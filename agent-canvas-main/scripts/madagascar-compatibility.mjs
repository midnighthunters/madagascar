export const MADAGASCAR_LEGACY_COMPATIBILITY_CUTOFF = "Madagascar 2.0";

export const MADAGASCAR_RUNTIME_ENVIRONMENT_ALIASES = {
  workspaceRoot: ["MADAGASCAR_WORKSPACE_ROOT", "OH_WORKSPACE_PATH"],
  sdkRoot: ["MADAGASCAR_SDK_PATH", "OH_AGENT_SERVER_LOCAL_PATH"],
  stateDir: ["MADAGASCAR_STATE_DIR", "OH_CANVAS_SAFE_STATE_DIR"],
  sessionApiKey: ["MADAGASCAR_SESSION_API_KEY", "LOCAL_BACKEND_API_KEY"],
  port: ["MADAGASCAR_AGENT_SERVER_PORT", "OH_CANVAS_SAFE_BACKEND_PORT"],
};

function nonEmpty(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function readMadagascarRuntimeEnvironment(env = process.env) {
  return Object.fromEntries(
    Object.entries(MADAGASCAR_RUNTIME_ENVIRONMENT_ALIASES).map(
      ([key, aliases]) => [
        key,
        aliases.map((name) => nonEmpty(env[name])).find(Boolean),
      ],
    ),
  );
}
