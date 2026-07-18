# Madagascar

Madagascar is a local-first coding-agent IDE. The default development path uses this React workbench and the checked-in `../software-agent-sdk-main` Agent Server. It keeps project state and credentials on the local machine and does **not** require Docker, a cloud account, a remote Agent Server, or automation services.

## Local setup

**Requirements:** Node.js 22.12+, npm 10.5.0, and [`uv`](https://docs.astral.sh/uv/getting-started/installation/). The SDK checkout at `../software-agent-sdk-main` is part of this workspace.

```sh
cd agent-canvas-main
npm ci
npm run dev
```

`npm run dev` starts the local Agent Server from the checked-in SDK, offline by default, on `127.0.0.1`, then opens the local Vite workbench on `http://127.0.0.1:3001`. Select a project by setting `MADAGASCAR_WORKSPACE_ROOT` (or `VITE_MADAGASCAR_WORKSPACE_ROOT` for the UI) before launch.

For an Agent-Server-only process owned by a desktop shell, use:

```sh
npm run runtime:local -- --workspace /path/to/project
# or, after packaging:
madagascar --workspace /path/to/project
```

The process is scoped to the chosen project directory. `--permission edit` is the default; use `read`, `execute`, `network`, or `unrestricted` only when appropriate. Local execution is not a sandbox—review the selected folder and permission before starting an agent.

## Configuration and state

New configuration uses `MADAGASCAR_*` / `VITE_MADAGASCAR_*` names. During the documented compatibility window, the local launcher can read the necessary legacy `OH_*` settings and the UI can read `VITE_WORKING_DIR`, `VITE_BACKEND_BASE_URL`, and `VITE_SESSION_API_KEY`. Madagascar values always take precedence.

Project state is stored under `madagascar-project:<project-root>` in browser storage (with native desktop storage authoritative when available). Known Agent Canvas/OpenHands keys are copied once when valid; legacy data is never removed. See [the naming inventory](docs/legacy-naming-inventory.md).

## Legacy compatibility surfaces

The `agent-canvas` CLI, Docker build, cloud/remote backend support, OAuth device flow, and automations are preserved only as compatibility surfaces through **Madagascar 2.0**. They are not launched by `npm run dev` and their routes live under `/legacy/...`.

```sh
npm run legacy:dev:automation
agent-canvas --help
```

These paths still use their historical clients and may use `uvx`, cloud endpoints, or automation services. Do not use them for the Madagascar local-first workflow.

## Verification

```sh
npm run lint:fix
npm run typecheck
npm run build
npm run test -- __tests__/madagascar
```

The production desktop shell remains an adapter boundary; this package currently supplies the local UI and runtime integration while native lifecycle ownership is completed.
