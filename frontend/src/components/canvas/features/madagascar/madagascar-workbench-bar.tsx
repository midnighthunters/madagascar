/* eslint-disable i18next/no-literal-string -- Madagascar desktop labels are outside the legacy Madagascar translation catalog. */
import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { setMadagascarRuntime } from "#/api/agent-server-config";
import { setMadagascarRuntimeBackend } from "#/api/backend-registry/active-store";
import {
  ANIMAL_AGENTS,
  getAnimalAgent,
  type AnimalId,
} from "#/madagascar/animal-registry";
import {
  canUseMadagascarDesktopBridge,
  invokeMadagascarDesktop,
} from "#/madagascar/desktop-bridge";
import {
  describeAnimalPermissions,
  canAnimalPerform,
} from "#/madagascar/role-policy";
import { MadagascarLocalRuntimeAdapter } from "#/madagascar/local-runtime-adapter";
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

/** Compact, local-first IDE chrome owned by the desktop workbench. */
export function MadagascarWorkbenchBar() {
  const selectedAnimal = useMadagascarStore((state) => state.selectedAnimal);
  const permission = useMadagascarStore((state) => state.permission);
  const projectRoot = useMadagascarStore((state) => state.projectRoot);
  const approvals = useMadagascarStore((state) => state.approvals);
  const delegations = useMadagascarStore((state) => state.delegations);
  const conversationIds = useMadagascarStore((state) => state.conversationIds);
  const runtime = useMadagascarStore((state) => state.runtime);
  const setSelectedAnimal = useMadagascarStore(
    (state) => state.setSelectedAnimal,
  );
  const setPermission = useMadagascarStore((state) => state.setPermission);
  const setProjectRoot = useMadagascarStore((state) => state.setProjectRoot);
  const setRuntime = useMadagascarStore((state) => state.setRuntime);
  const hydrateProject = useMadagascarStore((state) => state.hydrateProject);
  const createDelegation = useMadagascarStore(
    (state) => state.createDelegation,
  );
  const updateDelegation = useMadagascarStore(
    (state) => state.updateDelegation,
  );
  const addConversation = useMadagascarStore((state) => state.addConversation);
  const animal = useMemo(
    () => getAnimalAgent(selectedAnimal),
    [selectedAnimal],
  );
  const [projectDraft, setProjectDraft] = useState(projectRoot);
  const [delegationDraft, setDelegationDraft] = useState("");
  const [delegatedAnimal, setDelegatedAnimal] = useState<AnimalId>("owl");
  const [delegationError, setDelegationError] = useState<string | null>(null);
  const [runtimeStatus, setRuntimeStatus] = useState<
    "browser" | "starting" | "ready" | "stopped" | "unavailable"
  >("browser");

  const startRuntime = useCallback(async () => {
    if (!canUseMadagascarDesktopBridge()) return;
    const current = useMadagascarStore.getState();
    setRuntimeStatus("starting");
    try {
      const descriptor = await invokeMadagascarDesktop<LocalRuntimeDescriptor>(
        "start_local_runtime",
        {
          request: {
            workspaceRoot: current.projectRoot,
            sdkRoot: import.meta.env.VITE_MADAGASCAR_SDK_ROOT || null,
            permission: current.permission,
          },
        },
      );
      if (!descriptor)
        throw new Error("Madagascar desktop bridge is unavailable");
      setMadagascarRuntime(descriptor);
      setMadagascarRuntimeBackend({
        id: "madagascar-local-runtime",
        name: "Madagascar local runtime",
        host: descriptor.host,
        apiKey: descriptor.sessionApiKey,
        kind: "local",
      });
      setRuntime(descriptor);
      setRuntimeStatus("ready");
    } catch {
      setRuntimeStatus("unavailable");
    }
  }, [setRuntime]);

  const stopRuntime = useCallback(async () => {
    if (!canUseMadagascarDesktopBridge()) return;
    await invokeMadagascarDesktop("stop_local_runtime");
    setMadagascarRuntime(null);
    setMadagascarRuntimeBackend(null);
    setRuntime(null);
    setRuntimeStatus("stopped");
  }, [setRuntime]);

  useEffect(() => {
    if (!canUseMadagascarDesktopBridge()) return;
    void (async () => {
      await hydrateProject(projectRoot);
      await startRuntime();
    })();
  }, [hydrateProject, projectRoot, startRuntime]);

  useEffect(() => {
    if (!canUseMadagascarDesktopBridge()) return;
    void invokeMadagascarDesktop("set_permission_mode", { permission });
  }, [permission]);

  const pendingApprovals = approvals.filter(
    (approval) => approval.status === "pending",
  ).length;
  const activeDelegations = delegations.filter(
    (task) => task.status === "planned" || task.status === "running",
  ).length;
  const permissionRequiresRestart =
    runtime !== null && runtime.workspace.permission !== permission;

  const changeProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextProjectRoot = projectDraft.trim();
    if (!nextProjectRoot || nextProjectRoot === projectRoot) return;
    await stopRuntime();
    setProjectRoot(nextProjectRoot);
  };

  const delegateTask = async () => {
    const summary = delegationDraft.trim();
    const parentConversationId = conversationIds.at(-1);
    if (!canAnimalPerform(selectedAnimal, "delegate")) {
      setDelegationError(`${animal.name} cannot delegate work from this role.`);
      return;
    }
    if (!parentConversationId || !summary) {
      setDelegationError(
        "Create a conversation and enter a task before delegating.",
      );
      return;
    }

    setDelegationError(null);
    const delegationId = createDelegation(
      parentConversationId,
      delegatedAnimal,
      summary,
    );
    try {
      const child = await MadagascarLocalRuntimeAdapter.createConversation({
        animalId: delegatedAnimal,
        initialMessage: `Delegated task from ${animal.name}: ${summary}`,
        conversationInstructions:
          "Work only on this delegated task. Report findings and reviewable changes to the parent conversation.",
        parentConversationId,
        workspaceRoot: projectRoot,
      });
      if (child.app_conversation_id) addConversation(child.app_conversation_id);
      updateDelegation(delegationId, "running");
      setDelegationDraft("");
    } catch {
      updateDelegation(delegationId, "failed");
      setDelegationError("The delegated conversation could not be started.");
    }
  };

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

      <form className="madagascar-workspace-summary" onSubmit={changeProject}>
        <span className="madagascar-workspace-dot" aria-hidden="true" />
        <label className="sr-only" htmlFor="madagascar-project-root">
          Project folder
        </label>
        <input
          id="madagascar-project-root"
          aria-label="Project folder"
          className="madagascar-workspace-path"
          onChange={(event) => setProjectDraft(event.target.value)}
          value={projectDraft}
        />
      </form>

      {delegationError ? (
        <span className="madagascar-delegation-error" role="status">
          {delegationError}
        </span>
      ) : null}
      <div className="madagascar-workbench-controls">
        <label
          className="madagascar-control"
          title={describeAnimalPermissions(selectedAnimal)}
        >
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

        <label
          className="madagascar-control"
          title="Changes apply on the next runtime start."
        >
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

        <label
          className="madagascar-control"
          title="The active role must be able to plan before it can delegate."
        >
          <span className="sr-only">Delegated agent</span>
          <select
            aria-label="Delegated agent"
            value={delegatedAnimal}
            onChange={(event) =>
              setDelegatedAnimal(event.target.value as AnimalId)
            }
          >
            {ANIMAL_AGENTS.map((agent) => (
              <option key={agent.id} value={agent.id}>
                Delegate to {agent.name}
              </option>
            ))}
          </select>
        </label>

        <input
          aria-label="Delegated task"
          className="madagascar-delegation-input"
          onChange={(event) => setDelegationDraft(event.target.value)}
          placeholder="Delegate task"
          value={delegationDraft}
        />
        <button
          className="madagascar-runtime-button"
          disabled={!canAnimalPerform(selectedAnimal, "delegate")}
          onClick={() => void delegateTask()}
          type="button"
        >
          Delegate
        </button>

        {runtime ? (
          <button
            className="madagascar-runtime-button"
            onClick={() => void stopRuntime()}
            type="button"
          >
            Stop runtime
          </button>
        ) : (
          <button
            className="madagascar-runtime-button"
            onClick={() => void startRuntime()}
            type="button"
          >
            Start runtime
          </button>
        )}

        <span
          className={`madagascar-approval-count${pendingApprovals ? " is-pending" : ""}`}
          title={`${pendingApprovals} pending approval(s), ${activeDelegations} active delegated task(s)`}
        >
          {pendingApprovals
            ? `⚠ ${pendingApprovals} review`
            : permissionRequiresRestart
              ? "Restart to apply permission"
              : runtimeStatus === "ready"
                ? `${activeDelegations} active task${activeDelegations === 1 ? "" : "s"}`
                : runtimeStatus === "starting"
                  ? "Starting runtime"
                  : runtimeStatus === "unavailable"
                    ? "Desktop bridge offline"
                    : runtimeStatus === "stopped"
                      ? "Runtime stopped"
                      : "Local mode"}
        </span>
      </div>
    </header>
  );
}
