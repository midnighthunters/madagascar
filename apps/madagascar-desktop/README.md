# Madagascar Desktop

Madagascar is a local-first desktop IDE. Tauri owns the native lifecycle; the checked-in `software-agent-sdk-main` Agent Server runs only on loopback for the selected project.

## Supported hosts

| Host | Status | Requirements |
| --- | --- | --- |
| Windows 11 | Primary | WebView2, Rust, Node 22, Python 3.12+, `uv`, Git for Windows, and ripgrep |
| WSL2 | Fallback | Run the UI, `uv`, and project entirely inside the same WSL distribution |
| macOS/Linux | Best effort | Rust, Node 22, Python 3.12+, and `uv` |

Do not combine a Windows desktop process with a WSL workspace path. If a native Windows dependency is unavailable, use the WSL2 path consistently instead.

## Development

Install dependencies for `frontend`, Rust, Python, and `uv`. The Tauri configuration starts the UI with:

```powershell
npm --prefix frontend run dev
```

Then use the Tauri development command from `apps/madagascar-desktop/src-tauri`. The packaged shell consumes `frontend/build/client` and bundles `software-agent-sdk-main` as a resource.

`uv` must already have the SDK workspace dependencies available. The desktop runtime deliberately uses `uv run --offline --project software-agent-sdk-main --package openhands-agent-server`; it never resolves a published package or requires Docker.

## Runtime and state

`start_local_runtime` canonicalizes the selected project root, starts the Agent Server on `127.0.0.1`, streams process output to the UI, and returns a short-lived session descriptor. `stop_local_runtime` terminates its owned process tree.

Non-secret project state and Agent Server data live under `<project>/.madagascar/`. Do not store provider credentials in that directory or commit it to source control. The active workspace and permission mode are always displayed in the workbench.

## Permission modes

- **Read:** inspect files only.
- **Edit:** read and write files under the selected root.
- **Execute:** edit plus project-scoped commands.
- **Network:** execute with network-enabled work explicitly confirmed by the Agent Server.
- **Unrestricted:** outside-root access is allowed; use only after an explicit user decision.

The host process is not a sandbox. Permissions constrain Madagascar's runtime boundary but do not replace operating-system isolation.

## Hook installation on Windows

The root `make install-pre-commit-hooks` target requires a Unix `make`. In PowerShell, after the Poetry environment is available, use:

```powershell
poetry run pre-commit install --config .\dev_config\python\.pre-commit-config.yaml
```

The configured hooks require Git Bash and ripgrep on `PATH`; otherwise use the documented WSL2 fallback.
