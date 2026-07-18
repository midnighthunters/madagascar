import { describe, expect, it } from "vitest";
import {
  getMadagascarBrowserConfig,
  readMadagascarEnvironmentValue,
} from "#/madagascar/compatibility";
import { readMadagascarRuntimeEnvironment } from "../../scripts/madagascar-compatibility.mjs";

describe("Madagascar compatibility configuration", () => {
  it("gives Madagascar browser values precedence over legacy aliases", () => {
    const config = getMadagascarBrowserConfig({
      VITE_MADAGASCAR_WORKSPACE_ROOT: "C:/new-workspace",
      VITE_WORKING_DIR: "C:/legacy-workspace",
      VITE_MADAGASCAR_RUNTIME_URL: "http://127.0.0.1:19000",
      VITE_BACKEND_BASE_URL: "http://legacy.example",
      VITE_MADAGASCAR_SESSION_API_KEY: "new-key",
      VITE_SESSION_API_KEY: "legacy-key",
    });

    expect(config).toEqual({
      workspaceRoot: "C:/new-workspace",
      runtimeUrl: "http://127.0.0.1:19000",
      sessionApiKey: "new-key",
    });
  });

  it("uses a non-empty legacy browser alias during the migration window", () => {
    expect(
      readMadagascarEnvironmentValue(
        { VITE_WORKING_DIR: " workspace/project " },
        ["VITE_MADAGASCAR_WORKSPACE_ROOT", "VITE_WORKING_DIR"],
      ),
    ).toBe("workspace/project");
  });

  it("maps launcher aliases without overriding Madagascar values", () => {
    expect(
      readMadagascarRuntimeEnvironment({
        MADAGASCAR_WORKSPACE_ROOT: "C:/new-workspace",
        OH_WORKSPACE_PATH: "C:/legacy-workspace",
        OH_AGENT_SERVER_LOCAL_PATH: "C:/sdk",
        OH_CANVAS_SAFE_BACKEND_PORT: "19000",
      }),
    ).toMatchObject({
      workspaceRoot: "C:/new-workspace",
      sdkRoot: "C:/sdk",
      port: "19000",
    });
  });
});
