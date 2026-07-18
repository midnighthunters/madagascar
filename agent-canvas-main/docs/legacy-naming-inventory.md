# Madagascar legacy naming inventory

**Compatibility cutoff:** Madagascar 2.0. New Madagascar code must use the `MADAGASCAR_*`, `VITE_MADAGASCAR_*`, `madagascar-*`, and `madagascar.*` boundaries. This document records intentional exceptions rather than treating a global string replacement as safe.

| Category | Remaining legacy identifiers | Owner and retirement path |
| --- | --- | --- |
| Protocol compatibility | `OH_*`, `OPENHANDS_*`, Agent Server API paths, event names, serialized agent classes | Kept at the SDK/Agent Server adapter boundary until protocol versions provide a replacement. |
| Vendored SDK | `openhands-*` Python packages, `@openhands/typescript-client`, `@openhands/extensions` | Source dependency compatibility. Rename only as a staged SDK release with import and serialization migrations. |
| Legacy package and CLI | `@openhands/agent-canvas`, `agent-canvas` | Published alias retained through Madagascar 2.0; `madagascar` is the local runtime command. |
| Browser state | `agent-canvas-project:*`, `openhands-project:*` variants | Read once from explicit keys, copied only when Madagascar state is absent and valid, never deleted. |
| Environment aliases | `VITE_WORKING_DIR`, `VITE_BACKEND_BASE_URL`, `VITE_SESSION_API_KEY`, `OH_WORKSPACE_PATH`, `OH_AGENT_SERVER_LOCAL_PATH`, `OH_CANVAS_SAFE_*` | Read only in `src/madagascar/compatibility.ts` and `scripts/madagascar-compatibility.mjs`; Madagascar values win. |
| Cloud and automation | backend registry, OAuth, cloud API client, automation service and routes | Isolated behind legacy scripts and `/legacy/...` routes; remove only after consumer audit and local parity. |
| Deployment | Docker, Helm, container images, release/CI automation, root V1 app | Repository-level legacy ownership. Not part of Madagascar default startup; archive/remove only through a separate consumer-audited change. |
| UI copy and assets | historic translation namespace, OpenHands logo/assets, third-party provider/model names | Translation namespace and provider identifiers are implementation/protocol data. Replace visible default-surface copy when a Madagascar asset and migration are available. |

## Current enforcement

- `npm run dev` starts `scripts/dev-madagascar.mjs`: checked-in SDK, loopback Agent Server, Vite UI; no Docker, `uvx`, cloud, remote backend, or automation process.
- The legacy `agent-canvas` executable is explicitly marked as compatibility-only and continues to own its full automation stack.
- The root OpenHands V1 server, enterprise extension, containers, and Helm assets are intentionally untouched. Their consumers require a dedicated retirement audit.

Update this inventory whenever a compatibility alias is added or removed. The cutoff can move only in a deliberate release decision with upgrade guidance.
