import { randomBytes } from "node:crypto";
import { EventEmitter } from "node:events";
import { existsSync, mkdirSync, realpathSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createServer } from "node:net";
import {
  getProcessTreeSpawnOptions,
  isProcessRunning,
  signalProcessTree,
} from "./dev-process-utils.mjs";
import { readMadagascarRuntimeEnvironment } from "./madagascar-compatibility.mjs";

const LOOPBACK_HOST = "127.0.0.1";
const DEFAULT_PORT = 18000;
const DEFAULT_READY_TIMEOUT_MS = 60_000;
const SCRIPT_DIR = fileURLToPath(new URL(".", import.meta.url));
const DEFAULT_SDK_ROOT = resolve(SCRIPT_DIR, "../../software-agent-sdk-main");

const VALID_PERMISSIONS = new Set([
  "read",
  "edit",
  "execute",
  "network",
  "unrestricted",
]);

function findFreePort(preferredPort = DEFAULT_PORT) {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(preferredPort, LOOPBACK_HOST, () => {
      const address = server.address();
      if (address && typeof address === "object") {
        server.close(() => resolvePort(address.port));
      } else {
        server.close(() => reject(new Error("Could not allocate a local port")));
      }
    });
  }).catch(() =>
    new Promise((resolvePort, reject) => {
      const server = createServer();
      server.once("error", reject);
      server.listen(0, LOOPBACK_HOST, () => {
        const address = server.address();
        if (address && typeof address === "object") {
          server.close(() => resolvePort(address.port));
        } else {
          server.close(() => reject(new Error("Could not allocate a local port")));
        }
      });
    }),
  );
}

function requireDirectory(value, label) {
  const resolved = realpathSync(resolve(value));
  if (!existsSync(resolved) || !statSync(resolved).isDirectory()) {
    throw new Error(`${label} must be an existing directory: ${value}`);
  }
  return resolved;
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    values[key] = argv[index + 1]?.startsWith("--")
      ? true
      : (argv[++index] ?? true);
  }
  return values;
}

function getPermission(value) {
  const permission = value || "edit";
  if (!VALID_PERMISSIONS.has(permission)) {
    throw new Error(
      `Invalid permission '${permission}'. Choose read, edit, execute, network, or unrestricted.`,
    );
  }
  return permission;
}

function makeSessionApiKey(configuredSessionApiKey) {
  return configuredSessionApiKey || randomBytes(32).toString("hex");
}

/**
 * Owns exactly one host Agent Server process for a selected project.
 *
 * This intentionally starts the checked-in UV workspace instead of uvx or a
 * published package. It is a lifecycle boundary for the desktop shell; the
 * React UI should only consume the returned descriptor and log events.
 */
export class MadagascarLocalRuntime extends EventEmitter {
  constructor(options = {}) {
    super();
    const compatibility = readMadagascarRuntimeEnvironment();
    this.workspaceRoot = requireDirectory(
      options.workspaceRoot || compatibility.workspaceRoot || process.cwd(),
      "Workspace root",
    );
    this.sdkRoot = requireDirectory(
      options.sdkRoot || compatibility.sdkRoot || DEFAULT_SDK_ROOT,
      "SDK root",
    );
    this.stateDir = resolve(
      options.stateDir ||
        compatibility.stateDir ||
        join(homedir(), ".madagascar", "runtime"),
    );
    this.permission = getPermission(
      options.permission || process.env.MADAGASCAR_PERMISSION,
    );
    this.preferredPort = Number(options.port || compatibility.port || DEFAULT_PORT);
    this.process = null;
    this.descriptor = null;
    this.sessionApiKey = makeSessionApiKey(
      options.sessionApiKey || compatibility.sessionApiKey,
    );
    this.exitPromise = null;
  }

  async start() {
    if (this.process && isProcessRunning(this.process)) return this.descriptor;

    mkdirSync(this.stateDir, { recursive: true });
    const port = await findFreePort(this.preferredPort);
    const conversationsPath = join(this.stateDir, "conversations");
    const bashEventsPath = join(this.stateDir, "bash-events");
    mkdirSync(conversationsPath, { recursive: true });
    mkdirSync(bashEventsPath, { recursive: true });

    const args = [
      "run",
      ...(process.env.MADAGASCAR_ALLOW_UV_NETWORK === "1" ? [] : ["--offline"]),
      "--project",
      this.sdkRoot,
      "--package",
      "openhands-agent-server",
      "agent-server",
      "--host",
      LOOPBACK_HOST,
      "--port",
      String(port),
    ];
    const environment = {
      ...process.env,
      PYTHONUTF8: "1",
      OH_SESSION_API_KEYS_0: this.sessionApiKey,
      LOCAL_BACKEND_API_KEY: this.sessionApiKey,
      OH_WORKSPACE_PATH: this.workspaceRoot,
      OH_PERSISTENCE_DIR: this.stateDir,
      OH_CONVERSATIONS_PATH: conversationsPath,
      OH_BASH_EVENTS_DIR: bashEventsPath,
      MADAGASCAR_WORKSPACE_ROOT: this.workspaceRoot,
      MADAGASCAR_PERMISSION: this.permission,
    };

    this.emit("state", "starting");
    this.process = spawn(
      "uv",
      args,
      getProcessTreeSpawnOptions({
        cwd: this.workspaceRoot,
        env: environment,
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
      }),
    );
    this.exitPromise = new Promise((resolveExit) => {
      this.process.once("exit", (code, signal) => {
        this.emit("exit", { code, signal });
        this.emit("state", "crashed");
        resolveExit({ code, signal });
      });
    });

    this.process.stdout.on("data", (chunk) => this.emit("log", String(chunk)));
    this.process.stderr.on("data", (chunk) => this.emit("log", String(chunk)));
    this.process.once("error", (error) => this.emit("error", error));

    const host = `http://${LOOPBACK_HOST}:${port}`;
    this.descriptor = {
      host,
      port,
      sessionApiKey: this.sessionApiKey,
      workspace: {
        root: this.workspaceRoot,
        permission: this.permission,
        allowOutsideRoot: this.permission === "unrestricted",
      },
      sdkRoot: this.sdkRoot,
      status: "starting",
      pid: this.process.pid,
    };
    await this.waitUntilReady(host);
    this.descriptor = { ...this.descriptor, status: "ready" };
    this.emit("state", "ready");
    return this.descriptor;
  }

  async waitUntilReady(host, timeoutMs = DEFAULT_READY_TIMEOUT_MS) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
      if (!this.process || !isProcessRunning(this.process)) {
        throw new Error("Madagascar Agent Server exited before becoming ready");
      }
      try {
        const response = await fetch(`${host}/ready`);
        if (response.ok) return;
      } catch {
        // The server is still booting.
      }
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
    }
    throw new Error(`Timed out waiting for the local Agent Server at ${host}`);
  }

  async stop() {
    if (!this.process || !isProcessRunning(this.process)) {
      this.descriptor = this.descriptor
        ? { ...this.descriptor, status: "stopped" }
        : null;
      return;
    }

    this.emit("state", "stopping");
    signalProcessTree(this.process, "SIGTERM");
    await Promise.race([
      this.exitPromise,
      new Promise((resolveStop) => setTimeout(resolveStop, 5_000)),
    ]);
    if (isProcessRunning(this.process)) signalProcessTree(this.process, "SIGKILL");
    this.descriptor = this.descriptor
      ? { ...this.descriptor, status: "stopped" }
      : null;
    this.emit("state", "stopped");
  }
}

export function getCliOptions(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  return {
    workspaceRoot: args.workspace || process.env.MADAGASCAR_WORKSPACE_ROOT,
    sdkRoot: args["sdk-root"] || process.env.MADAGASCAR_SDK_PATH,
    stateDir: args.state || process.env.MADAGASCAR_STATE_DIR,
    permission: args.permission || process.env.MADAGASCAR_PERMISSION,
    port: args.port || process.env.MADAGASCAR_AGENT_SERVER_PORT,
  };
}

export async function runMadagascarLocalRuntime(
  argv = process.argv.slice(2),
) {
  const runtime = new MadagascarLocalRuntime(getCliOptions(argv));
  runtime.on("log", (message) => process.stderr.write(message));
  runtime.on("error", (error) => process.stderr.write(`${error.message}\n`));
  const shutdown = () => void runtime.stop().finally(() => process.exit(0));
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  const descriptor = await runtime.start();
  process.stdout.write(`${JSON.stringify({ type: "ready", ...descriptor })}\n`);
  await runtime.exitPromise;
}

const isMain = process.argv[1]
  ? resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))
  : false;
if (isMain) runMadagascarLocalRuntime().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
