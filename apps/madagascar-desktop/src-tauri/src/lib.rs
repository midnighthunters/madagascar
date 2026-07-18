use serde::{Deserialize, Serialize};
use std::fs;
use std::io::{BufRead, BufReader, Read};
use std::net::{TcpListener, TcpStream};
use std::path::PathBuf;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use std::thread;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter, Manager, State};

#[derive(Default)]
pub struct RuntimeState {
    child: Mutex<Option<Child>>,
    descriptor: Mutex<Option<RuntimeDescriptor>>,
    workspace_root: Mutex<Option<PathBuf>>,
    permission: Mutex<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StartRuntimeRequest {
    pub workspace_root: String,
    pub sdk_root: Option<String>,
    pub permission: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WriteProjectStateRequest {
    pub workspace_root: String,
    pub state: serde_json::Value,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RuntimeDescriptor {
    pub host: String,
    pub port: u16,
    pub session_api_key: String,
    pub workspace: WorkspacePolicy,
    pub sdk_root: String,
    pub status: String,
    pub pid: Option<u32>,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct WorkspacePolicy {
    pub root: String,
    pub permission: String,
    pub allow_outside_root: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceInfo {
    pub workspace_root: Option<String>,
    pub permission: String,
    pub runtime_running: bool,
}

fn project_state_path(workspace: &PathBuf) -> PathBuf {
    workspace.join(".madagascar").join("project-state.json")
}

fn canonical_directory(value: &str, label: &str) -> Result<PathBuf, String> {
    let path = fs::canonicalize(value)
        .map_err(|error| format!("{label} is not accessible: {error}"))?;
    if !path.is_dir() {
        return Err(format!("{label} must be a directory"));
    }
    Ok(path)
}

fn default_sdk_root(app: &AppHandle) -> Result<PathBuf, String> {
    if let Ok(configured) = std::env::var("MADAGASCAR_SDK_PATH") {
        return canonical_directory(&configured, "SDK root");
    }

    let development_root = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../../software-agent-sdk-main");
    if development_root.is_dir() {
        return canonical_directory(
            development_root.to_string_lossy().as_ref(),
            "SDK root",
        );
    }

    let resource_root = app
        .path()
        .resource_dir()
        .map_err(|error| format!("Could not resolve application resources: {error}"))?
        .join("software-agent-sdk-main");
    canonical_directory(resource_root.to_string_lossy().as_ref(), "SDK root")
}

fn stop_child_process_tree(child: &mut Child) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        let status = Command::new("taskkill")
            .args(["/PID", &child.id().to_string(), "/T", "/F"])
            .status()
            .map_err(|error| format!("Could not stop local runtime process tree: {error}"))?;
        if !status.success() {
            return Err(format!("taskkill exited with status {status}"));
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        child
            .kill()
            .map_err(|error| format!("Could not stop local runtime: {error}"))?;
    }

    let _ = child.wait();
    Ok(())
}

fn validate_permission(value: Option<String>) -> Result<String, String> {
    let permission = value.unwrap_or_else(|| "edit".to_string());
    match permission.as_str() {
        "read" | "edit" | "execute" | "network" | "unrestricted" => Ok(permission),
        _ => Err(format!("Unsupported permission mode: {permission}")),
    }
}

fn free_loopback_port() -> Result<u16, String> {
    let listener = TcpListener::bind(("127.0.0.1", 0))
        .map_err(|error| format!("Could not allocate a loopback port: {error}"))?;
    listener
        .local_addr()
        .map(|address| address.port())
        .map_err(|error| format!("Could not inspect the allocated port: {error}"))
}

fn wait_for_loopback_port(child: &mut Child, port: u16) -> Result<(), String> {
    let deadline = Instant::now() + Duration::from_secs(60);
    let address = format!("127.0.0.1:{port}");
    while Instant::now() < deadline {
        if let Some(status) = child.try_wait().map_err(|error| error.to_string())? {
            return Err(format!("Local Agent Server exited before it was ready: {status}"));
        }
        if TcpStream::connect_timeout(
            &address
                .parse()
                .map_err(|error| format!("Invalid local runtime address: {error}"))?,
            Duration::from_millis(250),
        )
        .is_ok()
        {
            return Ok(());
        }
        thread::sleep(Duration::from_millis(250));
    }
    Err(format!("Timed out waiting for the local Agent Server at {address}"))
}

#[cfg(target_os = "windows")]
#[link(name = "bcrypt")]
extern "system" {
    fn BCryptGenRandom(
        algorithm: *mut std::ffi::c_void,
        buffer: *mut u8,
        buffer_len: u32,
        flags: u32,
    ) -> i32;
}

#[cfg(target_os = "windows")]
fn random_session_bytes(bytes: &mut [u8; 32]) -> Result<(), String> {
    const BCRYPT_USE_SYSTEM_PREFERRED_RNG: u32 = 0x0000_0002;
    let status = unsafe {
        BCryptGenRandom(
            std::ptr::null_mut(),
            bytes.as_mut_ptr(),
            bytes.len() as u32,
            BCRYPT_USE_SYSTEM_PREFERRED_RNG,
        )
    };
    if status < 0 {
        return Err(format!("Windows could not generate a secure session key: {status}"));
    }
    Ok(())
}

#[cfg(not(target_os = "windows"))]
fn random_session_bytes(bytes: &mut [u8; 32]) -> Result<(), String> {
    fs::File::open("/dev/urandom")
        .and_then(|mut source| source.read_exact(bytes))
        .map_err(|error| format!("Could not generate a secure session key: {error}"))
}

fn session_key() -> Result<String, String> {
    let mut bytes = [0_u8; 32];
    random_session_bytes(&mut bytes)?;
    Ok(bytes.iter().map(|byte| format!("{byte:02x}")).collect())
}

fn emit_process_output<R: std::io::Read + Send + 'static>(app: AppHandle, reader: R, stream: &'static str) {
    thread::spawn(move || {
        for line in BufReader::new(reader).lines().map_while(Result::ok) {
            let _ = app.emit(
                "madagascar://runtime-log",
                serde_json::json!({ "stream": stream, "message": line }),
            );
        }
    });
}

#[tauri::command]
pub fn start_local_runtime(
    app: AppHandle,
    state: State<'_, RuntimeState>,
    request: StartRuntimeRequest,
) -> Result<RuntimeDescriptor, String> {
    let workspace = canonical_directory(&request.workspace_root, "Workspace root")?;
    let sdk_root = match request.sdk_root {
        Some(sdk_root) => canonical_directory(&sdk_root, "SDK root")?,
        None => default_sdk_root(&app)?,
    };
    let permission = validate_permission(request.permission)?;
    let mut child_guard = state.child.lock().map_err(|_| "Runtime state is poisoned")?;
    if let Some(child) = child_guard.as_mut() {
        if child.try_wait().map_err(|error| error.to_string())?.is_some() {
            *child_guard = None;
            *state
                .descriptor
                .lock()
                .map_err(|_| "Runtime state is poisoned")? = None;
        }
    }
    if child_guard.is_some() {
        return state
            .descriptor
            .lock()
            .map_err(|_| "Runtime state is poisoned")?
            .clone()
            .ok_or_else(|| "Runtime descriptor is unavailable".to_string());
    }

    let port = free_loopback_port()?;
    let state_dir = workspace.join(".madagascar");
    fs::create_dir_all(&state_dir)
        .map_err(|error| format!("Could not create Madagascar state directory: {error}"))?;
    let conversations = state_dir.join("conversations");
    let bash_events = state_dir.join("bash-events");
    fs::create_dir_all(&conversations).map_err(|error| error.to_string())?;
    fs::create_dir_all(&bash_events).map_err(|error| error.to_string())?;
    let api_key = session_key()?;

    let mut command = Command::new("uv");
    command
        .args(["run", "--offline", "--project"])
        .arg(&sdk_root)
        .args(["--package", "openhands-agent-server", "agent-server", "--host", "127.0.0.1", "--port"])
        .arg(port.to_string())
        .current_dir(&workspace)
        .env("PYTHONUTF8", "1")
        .env("OH_SESSION_API_KEYS_0", &api_key)
        .env("LOCAL_BACKEND_API_KEY", &api_key)
        .env("OH_WORKSPACE_PATH", &workspace)
        .env("OH_PERSISTENCE_DIR", &state_dir)
        .env("OH_CONVERSATIONS_PATH", &conversations)
        .env("OH_BASH_EVENTS_DIR", &bash_events)
        .env("MADAGASCAR_WORKSPACE_ROOT", &workspace)
        .env("MADAGASCAR_PERMISSION", &permission)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .stdin(Stdio::null());

    let mut child = command
        .spawn()
        .map_err(|error| format!("Could not start uv local Agent Server: {error}"))?;
    if let Err(error) = wait_for_loopback_port(&mut child, port) {
        let _ = stop_child_process_tree(&mut child);
        return Err(error);
    }
    if let Some(stdout) = child.stdout.take() {
        emit_process_output(app.clone(), stdout, "stdout");
    }
    if let Some(stderr) = child.stderr.take() {
        emit_process_output(app, stderr, "stderr");
    }
    let pid = child.id();
    *state.workspace_root.lock().map_err(|_| "Runtime state is poisoned")? = Some(workspace.clone());
    *state.permission.lock().map_err(|_| "Runtime state is poisoned")? = permission.clone();
    *child_guard = Some(child);

    let descriptor = RuntimeDescriptor {
        host: format!("http://127.0.0.1:{port}"),
        port,
        session_api_key: api_key,
        workspace: WorkspacePolicy {
            root: workspace.to_string_lossy().to_string(),
            permission: permission.clone(),
            allow_outside_root: permission == "unrestricted",
        },
        sdk_root: sdk_root.to_string_lossy().to_string(),
        status: "ready".to_string(),
        pid: Some(pid),
    };
    *state
        .descriptor
        .lock()
        .map_err(|_| "Runtime state is poisoned")? = Some(descriptor.clone());
    Ok(descriptor)
}

#[tauri::command]
pub fn stop_local_runtime(state: State<'_, RuntimeState>) -> Result<(), String> {
    let mut child_guard = state.child.lock().map_err(|_| "Runtime state is poisoned")?;
    if let Some(mut child) = child_guard.take() {
        stop_child_process_tree(&mut child)?;
    }
    *state
        .descriptor
        .lock()
        .map_err(|_| "Runtime state is poisoned")? = None;
    Ok(())
}

#[tauri::command]
pub fn workspace_info(state: State<'_, RuntimeState>) -> Result<WorkspaceInfo, String> {
    let workspace_root = state
        .workspace_root
        .lock()
        .map_err(|_| "Runtime state is poisoned")?
        .clone()
        .map(|path| path.to_string_lossy().to_string());
    let permission = state
        .permission
        .lock()
        .map_err(|_| "Runtime state is poisoned")?
        .clone();
    let runtime_running = state
        .child
        .lock()
        .map_err(|_| "Runtime state is poisoned")?
        .is_some();
    Ok(WorkspaceInfo {
        workspace_root,
        permission,
        runtime_running,
    })
}

#[tauri::command]
pub fn read_project_state(workspace_root: String) -> Result<Option<serde_json::Value>, String> {
    let workspace = canonical_directory(&workspace_root, "Workspace root")?;
    let path = project_state_path(&workspace);
    if !path.is_file() {
        return Ok(None);
    }
    let contents = fs::read_to_string(&path)
        .map_err(|error| format!("Could not read Madagascar project state: {error}"))?;
    serde_json::from_str(&contents)
        .map(Some)
        .map_err(|error| format!("Madagascar project state is invalid JSON: {error}"))
}

#[tauri::command]
pub fn write_project_state(request: WriteProjectStateRequest) -> Result<(), String> {
    let workspace = canonical_directory(&request.workspace_root, "Workspace root")?;
    let path = project_state_path(&workspace);
    let directory = path
        .parent()
        .ok_or_else(|| "Madagascar project state has no parent directory".to_string())?;
    fs::create_dir_all(directory)
        .map_err(|error| format!("Could not create Madagascar state directory: {error}"))?;
    let contents = serde_json::to_string_pretty(&request.state)
        .map_err(|error| format!("Could not serialize Madagascar project state: {error}"))?;
    fs::write(&path, contents)
        .map_err(|error| format!("Could not write Madagascar project state: {error}"))
}

#[tauri::command]
pub fn set_permission_mode(
    state: State<'_, RuntimeState>,
    permission: String,
) -> Result<WorkspaceInfo, String> {
    let permission = validate_permission(Some(permission))?;
    *state.permission.lock().map_err(|_| "Runtime state is poisoned")? = permission;
    workspace_info(state)
}

pub fn run() {
    tauri::Builder::default()
        .manage(RuntimeState {
            child: Mutex::new(None),
            descriptor: Mutex::new(None),
            workspace_root: Mutex::new(None),
            permission: Mutex::new("edit".to_string()),
        })
        .invoke_handler(tauri::generate_handler![
            start_local_runtime,
            stop_local_runtime,
            workspace_info,
            read_project_state,
            write_project_state,
            set_permission_mode
        ])
        .run(tauri::generate_context!())
        .expect("error while running Madagascar desktop");
}
