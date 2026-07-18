#!/usr/bin/env node
/**
 * Madagascar's local runtime command. It starts the checked-in SDK Agent
 * Server on loopback; the desktop shell or `npm run dev:madagascar` owns UI.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runMadagascarLocalRuntime } from "../scripts/madagascar-local-runtime.mjs";
import { MADAGASCAR_LEGACY_COMPATIBILITY_CUTOFF } from "../scripts/madagascar-compatibility.mjs";

const directory = dirname(fileURLToPath(import.meta.url));
const packageJson = join(directory, "..", "package.json");
const args = process.argv.slice(2);

if (args.includes("-v") || args.includes("--version")) {
  console.log(JSON.parse(readFileSync(packageJson, "utf8")).version);
  process.exit(0);
}

if (args.includes("-h") || args.includes("--help")) {
  console.log(`Madagascar local runtime

USAGE:
  madagascar [options]

Starts the checked-in software-agent-sdk Agent Server on 127.0.0.1. It does not
start Docker, cloud services, remote backends, or automation services.

OPTIONS:
  --workspace <path>       Local project root (default: current directory)
  --sdk-root <path>        software-agent-sdk-main checkout
  --state <path>           Local Madagascar runtime state directory
  --permission <level>     read, edit, execute, network, or unrestricted
  --port <port>            Preferred loopback Agent Server port
  -v, --version            Show version
  -h, --help               Show this help

The legacy agent-canvas command remains available through ${MADAGASCAR_LEGACY_COMPATIBILITY_CUTOFF}.`);
  process.exit(0);
}

await runMadagascarLocalRuntime(args);
