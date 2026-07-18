import { spawn } from "node:child_process";
import process from "node:process";
import { MadagascarLocalRuntime, getCliOptions } from "./madagascar-local-runtime.mjs";
import {
  getProcessTreeSpawnOptions,
  signalProcessTree,
} from "./dev-process-utils.mjs";

const LOOPBACK_HOST = "127.0.0.1";

function frontendCommand() {
  return process.platform === "win32"
    ? { command: "npm.cmd", args: ["run", "dev:frontend"] }
    : { command: "npm", args: ["run", "dev:frontend"] };
}

async function main() {
  const runtime = new MadagascarLocalRuntime(getCliOptions());
  runtime.on("log", (message) => process.stderr.write(message));
  runtime.on("error", (error) => process.stderr.write(`${error.message}\n`));

  const descriptor = await runtime.start();
  const port = process.env.MADAGASCAR_FRONTEND_PORT || "3001";
  const { command, args } = frontendCommand();
  const frontend = spawn(
    command,
    [...args, "--", "--host", LOOPBACK_HOST, "--port", port],
    getProcessTreeSpawnOptions({
      cwd: process.cwd(),
      env: {
        ...process.env,
        VITE_MADAGASCAR_LOCAL_MODE: "true",
        VITE_MADAGASCAR_RUNTIME_URL: descriptor.host,
        VITE_MADAGASCAR_WORKSPACE_ROOT: descriptor.workspace.root,
        VITE_MADAGASCAR_SESSION_API_KEY: descriptor.sessionApiKey,
      },
      stdio: "inherit",
      windowsHide: true,
    }),
  );

  const shutdown = async () => {
    signalProcessTree(frontend, "SIGTERM");
    await runtime.stop();
    process.exit(0);
  };
  process.once("SIGINT", () => void shutdown());
  process.once("SIGTERM", () => void shutdown());
  frontend.once("exit", () => void runtime.stop());
  frontend.once("error", (error) => {
    process.stderr.write(`${error.message}\n`);
    void runtime.stop();
  });

  process.stdout.write(
    `Madagascar local IDE ready: ${descriptor.host} (frontend http://${LOOPBACK_HOST}:${port})\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
