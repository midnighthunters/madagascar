# Madagascar IDE Masterplan

**Status:** Planning baseline
**Scope:** Convert this workspace into a local-first desktop IDE for coding agents.
**Product direction:** Madagascar — a jungle-themed, text-editor-first IDE inspired by Codex and Cursor.

## 1. Product definition

Madagascar is a native desktop application, not a hosted web product and not a visual workflow/canvas tool. It should open a local project folder, start local agent processes, and provide one focused coding workspace:

- file explorer and tabs
- Monaco-style source editor
- inline and side-by-side diffs
- terminal and task output
- agent chat and streaming activity
- plan, approval, and undo controls
- Git status and review surface
- model/provider settings stored locally

The application must work without Docker, cloud APIs, a remote agent server, or a mandatory external service. Network access is optional and limited to the configured model provider. The local project and credentials remain on the user's machine.

## 2. Existing repository assessment

This is currently a multi-project workspace rather than a single application:

- Root `openhands/` and `frontend/`: the older OpenHands application server and V1 frontend.
- `agent-canvas-main/`: a React/TypeScript client with its own Agent Server API contract and launcher.
- `software-agent-sdk-main/`: a local UV workspace containing SDK, tools, workspace, and Agent Server packages.
- `enterprise/`, `openhands-ui/`, container files, Helm/Kubernetes files, release workflows, and cloud integrations: supporting or deployment-oriented surfaces.

The root app uses `/api/v1/app-conversations` and process/Docker/remote sandbox services. Agent Canvas uses direct Agent Server conversation APIs. These contracts are related but not interchangeable. The local SDK checkout is not automatically used by the root application today; Agent Canvas has explicit local-agent-server support.

## 3. Decisions to lock in

1. **Canonical product:** use Agent Canvas's React UI as the starting presentation layer, but refactor it into a Madagascar desktop UI instead of merging two complete frontends.
2. **Canonical runtime:** use the checked-in `software-agent-sdk-main` packages and its Agent Server as the local execution core. Avoid published package resolution and cloud backends in the default path.
3. **Desktop shell:** introduce a native shell around the local UI. Tauri is the preferred target for a smaller local footprint; Electron is the fallback if Node-only integration materially reduces risk. The shell owns lifecycle, filesystem permissions, native menus, and process supervision.
4. **Execution:** use a host-process `LocalWorkspace` backend with explicit workspace roots and user confirmation. Docker becomes an optional legacy backend during migration, then is removed from the default product and eventually retired.
5. **UI language:** no node graphs, agent canvases, automation boards, or browser-first deployment. Use standard IDE surfaces: editor, tree, terminal, chat, diffs, problems, and source control.
6. **Naming:** the visible and user-facing product becomes Madagascar. Internal protocol compatibility is migrated in stages so existing conversations, plugins, and SDK clients are not stranded.

## 4. Animal agent roster

Keep the roster deliberately small and recognizable. Animals are roles and personalities, not separate implementations:

| Agent | Role | Default behavior |
|---|---|---|
| Lion | Lead engineer | Owns a task, delegates when useful, summarizes decisions |
| Elephant | Context keeper | Builds repository context, remembers constraints, tracks decisions |
| Cheetah | Implementer | Makes focused code changes quickly and reports touched files |
| Gorilla | Refactorer | Simplifies architecture, removes duplication, preserves behavior |
| Owl | Reviewer | Inspects diffs, flags risks, checks edge cases and maintainability |
| Chameleon | Adapter | Handles API, provider, platform, and compatibility translations |
| Lemur | Explorer | Searches unfamiliar code and proposes the smallest safe path |
| Zebra | Release guide | Checks local configuration, packaging, and migration readiness |

Store this roster in a typed local registry so adding an animal does not require editing unrelated UI components. Do not create dozens of animal variants or expose implementation-specific names to users.

## 5. Target architecture

```text
Madagascar desktop shell
  ├─ Native lifecycle, menus, file permissions, process supervision
  ├─ Local IPC bridge
  └─ Madagascar React UI
       ├─ Workspace and editor state
       ├─ Agent roster and chat
       ├─ Diff/approval/undo flows
       ├─ Terminal and source control panels
       └─ Local-only settings and persistence

Local application services
  ├─ SDK Agent Server from software-agent-sdk-main
  ├─ LocalWorkspace / process executor
  ├─ Conversation and event persistence
  ├─ Model provider adapter
  ├─ Credential vault adapter
  └─ Git/filesystem adapters
```

The UI must call a single Madagascar client/service boundary. Components must not call raw Axios/fetch clients directly. Keep transport adapters behind query/mutation hooks or an equivalent typed application service layer. This isolates the current Agent Server API while the root V1 API is retired.

## 6. Repository restructuring

Do not delete required source, migration, or deployment files. Move code only after imports and package references are updated. The target layout should be introduced incrementally:

```text
apps/
  madagascar-desktop/       # Tauri/Electron shell and native bridge
  madagascar-ui/             # React IDE UI derived from agent-canvas-main
services/
  local-runtime/             # process supervision, workspace policy, IPC
  agent-server/              # local SDK Agent Server integration boundary
packages/
  madagascar-contracts/      # typed events, agent roles, settings, IPC
  madagascar-theme/          # jungle palette, icons, typography
  legacy-compat/             # old names/env/state readers during migration
vendor/
  software-agent-sdk/        # local SDK workspace kept as a source dependency
archive/
  legacy-web/                # root V1 web/server pieces only after replacement
```

For the first implementation slices, keep existing directories in place and add adapter boundaries rather than physically moving the whole repository. Physical moves happen only per package, with import updates and a clean ownership decision.

## 7. Rename strategy: OpenHands → Madagascar

A blind global replacement is unsafe. The same string appears in Python import namespaces, npm packages, protocol paths, persisted state, environment variables, provider model identifiers, Docker images, URLs, test fixtures, and external compatibility contracts.

Use four migration layers:

1. **Brand layer first:** titles, logos, product copy, CLI help, window title, local logs, docs, and UI translations use Madagascar.
2. **Application layer second:** introduce `madagascar.*`, `@madagascar/*`, `MADAGASCAR_*`, `madagascar-*`, and `~/.madagascar` equivalents. New code uses only these names.
3. **Compatibility layer:** read old `OPENHANDS_*`/`OH_*` settings, old state directories, old package/module names, and old API headers when present. On first run, migrate or copy state safely; never silently delete the old state.
4. **Removal layer last:** after the local product no longer depends on old consumers, rename Python directories, package metadata, CLI commands, persisted identifiers, and release/configuration references. Keep explicit legacy aliases for one release window.

Rename categories to track explicitly:

- Python distribution and namespaces: `openhands-ai`, `openhands.*`, SDK/tool/workspace/agent-server package metadata.
- JavaScript metadata and imports: `@openhands/*`, `agent-canvas`, package names, CLI binary, local storage keys.
- Config and state: `OH_*`, `OPENHANDS_*`, `~/.openhands`, state subdirectories, API key files, persisted conversation metadata.
- Product surfaces: README, docs, FastAPI title, telemetry, icons, assets, logs, help text, workflow names.
- Infrastructure leftovers: Docker/Compose/Helm images, CI/release metadata, container names, cloud URLs, and external repository links.
- Protocol identifiers: API paths, event names, model prefixes, and serialized class names. These need adapters or versioned migration, not string replacement.

The final state should have no user-visible OpenHands branding, while compatibility-only identifiers are isolated under `legacy-compat/` and documented.

## 8. Phased implementation plan

### Phase 0 — Freeze the boundary

- Record the current root, Agent Canvas, and SDK contracts.
- Confirm the supported host matrix, starting with Windows and a documented WSL fallback if native process tooling is insufficient.
- Define workspace permission levels: read-only, edit, execute, network, and unrestricted.
- Decide the desktop shell (Tauri preferred, Electron fallback) before adding native code.
- Keep the current staged deletions untouched; do not use broad cleanup commands.

**Deliverable:** this plan plus a short architecture decision record under `.pr/`.

### Phase 1 — Local runtime proof

- Make the checked-in SDK workspace the only default Agent Server source.
- Replace `uvx`/published package resolution in the local launcher with a source-path launcher for `software-agent-sdk-main`.
- Add a local process supervisor with PID tracking, port allocation, graceful shutdown, crash cleanup, and log streaming.
- Start the server with a project-scoped working directory, not a global unrestricted directory.
- Disable cloud, automation, remote backends, and Docker from the default startup path without deleting their source yet.
- Add a single typed local runtime adapter consumed by the UI.

**Deliverable:** Madagascar can open one local folder and start one local agent server without Docker.

### Phase 2 — IDE shell and code-first UI

- Extract the usable editor, file tree, terminal, chat, diff, and settings components from `agent-canvas-main`.
- Remove or hide automation, cloud-backend switching, hosted onboarding, and canvas/graph concepts from the default route.
- Add native window lifecycle and a secure IPC bridge.
- Make file operations, command execution, and agent edits permission-aware.
- Add keyboard-first commands, project switching, tab persistence, and agent activity status.
- Use a jungle theme through tokens: dark forest base, leaf/amber accents, restrained animal icons, and high-contrast diffs. Do not turn the editor into a decorative game UI.

**Deliverable:** a local desktop IDE experience with standard coding surfaces and no web deployment requirement.

### Phase 3 — Agent model and collaboration UX

- Add the typed animal roster and a role-to-capability policy.
- Map each agent to prompts/configuration, not duplicated code.
- Implement agent selection, task delegation, plan approval, edit approval, cancellation, retry, and undo.
- Keep all changes reviewable as file diffs before applying high-risk operations.
- Persist conversations and decisions per project under the Madagascar state directory.
- Support multiple local conversations without requiring a remote account.

**Deliverable:** users can select Lion, Elephant, Cheetah, Gorilla, Owl, Chameleon, Lemur, or Zebra and understand what each role is doing.

### Phase 4 — Naming migration

- Add display branding and Madagascar config aliases first.
- Introduce migration readers for old settings and state.
- Rename package and import boundaries one workspace at a time: contracts, local runtime, SDK integration, UI, then shell.
- Replace old package names and CLI entry points only after local source execution works.
- Generate a migration report for remaining legacy strings, class paths, environment variables, and serialized data.
- Preserve legacy aliases until a deliberate release cutoff.

**Deliverable:** Madagascar is the only visible product identity and new code no longer introduces OpenHands names.

### Phase 5 — Simplification and retirement

- Remove root V1 web-only routes that are not used by the desktop app.
- Retire Docker from the default dependency graph and startup scripts; remove Docker-only code only after local runtime parity is established.
- Archive or isolate cloud, enterprise, automation, remote sandbox, Helm, and container packaging paths that are outside the local IDE scope.
- Consolidate duplicate API clients, settings stores, conversation models, and launcher logic.
- Reduce the top-level build to desktop shell, UI, local services, and vendored SDK workspace.
- Update documentation to describe one local product and one local setup path.

**Deliverable:** a smaller local-first repository with clear ownership and no accidental web/cloud/Docker requirement.

## 9. Refactoring priorities

Prioritize these refactors before visual polish:

1. One conversation/event model at the application boundary.
2. One local runtime lifecycle owner.
3. One typed filesystem/workspace policy service.
4. One settings and credential store with migration support.
5. One agent-role registry instead of hardcoded UI conditionals.
6. One diff/approval pipeline for all file edits and commands.
7. One transport adapter for the local Agent Server.
8. One theme/token package shared by desktop surfaces.
9. Removal of cloud/backend registry state from the local default path.
10. Elimination of duplicate root V1 and Agent Canvas implementations after the adapter is stable.

## 10. Security and local-runtime requirements

Docker removal changes the threat model. A local process backend is not a security sandbox. Before unrestricted execution is exposed:

- scope each agent to the opened project root by default;
- require confirmation for delete, network, credential, and outside-root operations;
- redact secrets from logs and agent context;
- use OS-native process groups and terminate descendants on shutdown;
- allocate and reclaim local ports safely;
- avoid binding services publicly; default to loopback;
- make browser automation and VS Code services optional;
- show the active workspace and permission mode prominently;
- provide stop, pause, and undo controls that work even when an agent is busy;
- document that local agents can access anything allowed by the selected permission mode.

## 11. Explicit non-goals for the first release

- No hosted web deployment.
- No Docker requirement or Docker-first workflow.
- No cloud account, organization, billing, or remote sandbox requirement.
- No scheduled automation platform.
- No node graph, visual workflow canvas, or code-generation diagram UI.
- No large animal catalog or animated mascot system.
- No rewrite of every legacy package before the local IDE path is usable.
- No deletion of necessary source, migration, or compatibility files during the initial refactor.

## 12. Completion criteria

The conversion is complete when a fresh local checkout can:

1. launch Madagascar as a desktop application without Docker;
2. open a local project folder and show its files in a normal IDE layout;
3. start and stop the checked-in local Agent Server without external package downloads;
4. configure a model provider locally and keep credentials out of project files;
5. run a conversation, stream events, show planned actions, and require approval for risky edits;
6. review and undo agent file changes through diffs;
7. use a terminal scoped to the selected project;
8. persist and restore project conversations locally;
9. show only Madagascar branding and the approved animal roster;
10. retain a documented migration path for old OpenHands settings and state until the compatibility window ends.

## 13. Immediate next implementation slice

The first code change after this plan should be a small local-runtime foundation, not a global rename:

- add a `madagascar` application/contracts boundary;
- add a source-path Agent Server launcher for `software-agent-sdk-main`;
- add local workspace-root and permission configuration;
- add a minimal typed adapter from the UI to the local Agent Server;
- wire the launcher behind an explicit local-only command;
- update visible product copy only after that path has a stable owner.

Do not run a full repository build or add a new test suite for this planning change. Future implementation should use targeted type/lint checks only when the changed package requires them.
