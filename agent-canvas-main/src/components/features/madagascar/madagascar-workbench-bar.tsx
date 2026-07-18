import { useEffect, useMemo, useState } from "react";
import { setMadagascarRuntime } from "#/api/agent-server-config";
import { setMadagascarRuntimeBackend } from "#/api/backend-registry/active-store";
import { ANIMAL_AGENTS, getAnimalAgent } from "#/madagascar/animal-registry";
import {
  canUseMadagascarDesktopBridge,
  invokeMadagascarDesktop,
} from "#/madagascar/desktop-bridge";
import type {
  LocalRuntimeDescriptor,
  WorkspacePermission,
} from "#/madagascar/contracts";
import { useMadagascarStore } from "#/stores/madagascar-store";

const PERMISSIONS: Array<{ value: WorkspacePermission; label: string }> = [
  { value: "read", label: "Read only" },
  { value: "edit", label: "Edit files" },
  { value: "execute", label: "Edit + terminal" },
  { value: "network", label: "Network enabled" },
  { value: "unrestricted", label: "Unrestricted" },
];

/** Compact IDE chrome for the local Madagascar desktop and dev bridge. */
export function MadagascarWorkbenchBar() {
  const selectedAnimal = useMadagascarStore((state) => state.selectedAnimal);
  const permission = useMadagascarStore((state) => state.permission);
  const projectRoot = useMadagascarStore((state) => state.projectRoot);
  const approvals = useMadagascarStore((state) => state.approvals);
  const runtime = useMadagascarStore((state) => state.runtime);
  const setSelectedAnimal = useMadagascarStore(
    (state) => state.setSelectedAnimal,
  );
  const setPermission = useMadagascarStore((state) => state.setPermission);
  const setRuntime = useMadagascarStore((state) => state.setRuntime);
  const animal = useMemo(
    () => getAnimalAgent(selectedAnimal),
    [selectedAnimal],
  );
  const pendingApprovals = approvals.filter(
    (approval) => approval.status === "pending",
  ).length;
  const permissionRequiresRestart =
    runtime !== null && runtime.workspace.permission !== permission;
  const [runtimeStatus, setRuntimeStatus] = useState<
    "browser" | "starting" | "ready" | "unavailable"
  >("browser");

  useEffect(() => {
    if (!canUseMadagascarDesktopBridge()) return;
    if (!/^(?:[A-Za-z]:[\\/]|\\\\|\/)/.test(projectRoot)) {
      setRuntimeStatus("unavailable");
      return;
    }

    setRuntimeStatus("starting");
    const request = invokeMadagascarDesktop<LocalRuntimeDescriptor>(
      "start_local_runtime",
      {
        request: {
          workspaceRoot: projectRoot,
          sdkRoot: import.meta.env.VITE_MADAGASCAR_SDK_ROOT || null,
          stateDir: import.meta.env.VITE_MADAGASCAR_STATE_DIR || null,
          permission,
        },
      },
    );
    void request
      ?.then((descriptor) => {
        setMadagascarRuntime(descriptor);
        setMadagascarRuntimeBackend({
          id: "madagascar-local-runtime",
          name: "Madagascar local runtime",
          host: descriptor.host,
          apiKey: descriptor.sessionApiKey,
          kind: "local",
        });
        setRuntime(descriptor);
        setRuntimeStatus(
          descriptor.status === "crashed" ? "unavailable" : "ready",
        );
      })
      .catch(() => setRuntimeStatus("unavailable"));
  }, [projectRoot, permission, setRuntime]);

  useEffect(() => {
    if (!canUseMadagascarDesktopBridge()) return;
    void invokeMadagascarDesktop("set_permission_mode", { permission });
  }, [permission]);

  return (
    <header
      className="madagascar-workbench-bar"
      data-testid="madagascar-workbench-bar"
    >
      <div className="madagascar-brand-lockup">
        <span className="madagascar-brand-mark" aria-hidden="true">
          🌿
        </span>
        <span className="madagascar-brand-name">Madagascar</span>
        <span className="madagascar-local-badge">LOCAL</span>
      </div>

      <div className="madagascar-workspace-summary" title={projectRoot}>
        <span className="madagascar-workspace-dot" aria-hidden="true" />
        <span className="madagascar-workspace-path">{projectRoot}</span>
      </div>

      <div className="madagascar-workbench-controls">
        <label className="madagascar-control">
          <span className="sr-only">Active Madagascar agent</span>
          <span aria-hidden="true">{animal.emoji}</span>
          <select
            aria-label="Active Madagascar agent"
            value={selectedAnimal}
            onChange={(event) =>
              setSelectedAnimal(event.target.value as typeof selectedAnimal)
            }
          >
            {ANIMAL_AGENTS.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.emoji} {agent.name} · {agent.role}
              </option>
            ))}
          </select>
        </label>

        <label className="madagascar-control">
          <span className="sr-only">Workspace permission</span>
          <select
            aria-label="Workspace permission"
            value={permission}
            onChange={(event) =>
              setPermission(event.target.value as WorkspacePermission)
            }
          >
            {PERMISSIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <span
          className={`madagascar-approval-count${pendingApprovals ? " is-pending" : ""}`}
          title={`${pendingApprovals} pending approval${pendingApprovals === 1 ? "" : "s"}`}
        >
          {pendingApprovals
            ? `⚠ ${pendingApprovals} pending`
            : permissionRequiresRestart
              ? "Restart runtime to apply permissions"
              : runtimeStatus === "ready"
                ? "Runtime ready"
                : runtimeStatus === "starting"
                  ? "Starting runtime"
                  : runtimeStatus === "unavailable"
                    ? "Desktop bridge offline"
                    : "Local mode"}
        </span>
      </div>
    </header>
  );
}
