export const MADAGASCAR_LEGACY_COMPATIBILITY_CUTOFF = "Madagascar 2.0";

type EnvironmentValues = Record<string, string | boolean | undefined>;

export interface MadagascarBrowserConfig {
  workspaceRoot: string | null;
  runtimeUrl: string | null;
  sessionApiKey: string | null;
}

export const MADAGASCAR_BROWSER_ENVIRONMENT_ALIASES = {
  workspaceRoot: ["VITE_MADAGASCAR_WORKSPACE_ROOT", "VITE_WORKING_DIR"],
  runtimeUrl: ["VITE_MADAGASCAR_RUNTIME_URL", "VITE_BACKEND_BASE_URL"],
  sessionApiKey: ["VITE_MADAGASCAR_SESSION_API_KEY", "VITE_SESSION_API_KEY"],
} as const;

function nonEmpty(value: string | boolean | undefined): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function readMadagascarEnvironmentValue(
  env: EnvironmentValues,
  aliases: readonly string[],
): string | null {
  for (const name of aliases) {
    const value = nonEmpty(env[name]);
    if (value) return value;
  }
  return null;
}

export function getMadagascarBrowserConfig(
  env: EnvironmentValues = import.meta.env,
): MadagascarBrowserConfig {
  return {
    workspaceRoot: readMadagascarEnvironmentValue(
      env,
      MADAGASCAR_BROWSER_ENVIRONMENT_ALIASES.workspaceRoot,
    ),
    runtimeUrl: readMadagascarEnvironmentValue(
      env,
      MADAGASCAR_BROWSER_ENVIRONMENT_ALIASES.runtimeUrl,
    ),
    sessionApiKey: readMadagascarEnvironmentValue(
      env,
      MADAGASCAR_BROWSER_ENVIRONMENT_ALIASES.sessionApiKey,
    ),
  };
}
