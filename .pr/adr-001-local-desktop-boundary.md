# ADR-001: Local desktop runtime boundary

**Status:** Accepted
**Date:** 2026-07-18

## Context
Madagascar is a local-first coding IDE. The workspace still contains OpenHands V1, Agent Canvas, and the checked-in Software Agent SDK, whose API and lifecycle contracts are related but not interchangeable.

## Decision
- **Desktop shell:** Tauri is the production shell. It owns Agent Server startup, shutdown, loopback networking, workspace validation, and desktop persistence. The Node launcher is a development-only wrapper.
- **Runtime:** the checked-in `software-agent-sdk-main` Agent Server is the sole default runtime. It is launched from source through `uv run --offline`; Docker, published `uvx` packages, cloud backends, and automation are not on the Madagascar default path.
- **UI boundary:** Madagascar UI code uses `MadagascarLocalRuntimeAdapter` and typed query/mutation hooks. Legacy API clients remain only behind that boundary while migration proceeds.
- **Workspace policy:** every runtime has one canonical project root and exactly one permission mode: `read`, `edit`, `execute`, `network`, or `unrestricted`. All non-unrestricted operations stay inside the root. Command execution requires `execute`, `network`, or `unrestricted`; file writes require `edit`, `execute`, `network`, or `unrestricted`.
- **State:** each project stores non-secret Madagascar state in `<project>/.madagascar/project-state.json`; Agent Server conversations/logs use the same `<project>/.madagascar` directory. Credentials are never written there.
- **Agent collaboration:** animal roles are registry data, prompts, and an enforced UI capability policy. Agent Server confirmations remain the authority for execution; Madagascar records the resulting approval decision with the project.

## Host support
Native Windows 11 with WebView2, Rust, Node 22, Python 3.12+, and `uv` is the primary host. Git for Windows and ripgrep are required for repository hooks. WSL2 is the documented fallback when a host dependency or shell tool is unavailable; do not mix a Windows UI with a WSL workspace path in one runtime.

## Consequences
- The shell and development launcher may share a protocol, but only Tauri is the shipped lifecycle owner.
- The local host process is not an OS security sandbox. Madagascar presents the active workspace and permission mode, requires Agent Server confirmation for risky work, and never silently broadens the workspace boundary.
- Legacy OpenHands identifiers are compatibility-only until the naming migration phase; this ADR does not authorize a global rename.
