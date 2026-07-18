# Madagascar Desktop

This is the native shell for the Madagascar local IDE.

The shell is intentionally separate from `agent-canvas-main`: the React UI remains reusable, while this Tauri layer owns the local process lifecycle, workspace policy, and secure command bridge.

## Development

The shell expects the UI build at `../../../agent-canvas-main/build`, relative to `src-tauri`, for a packaged run. During development it uses the Agent Canvas development server through the Tauri `devUrl` configuration.

The native commands are deliberately small:

- `start_local_runtime` validates a project root, starts the checked-in SDK Agent Server on loopback, and returns a session descriptor.
- `stop_local_runtime` terminates the owned process.
- `workspace_info` returns the canonical project root and permission mode.
- `set_permission_mode` records the next explicit local policy. Changing it while the Agent Server is running requires stopping and restarting the runtime, which the workbench shows explicitly.

The local process is host-native and is not a security sandbox. The user must choose the permission mode deliberately.
