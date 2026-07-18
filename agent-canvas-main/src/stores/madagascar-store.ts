import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { type AnimalId } from "#/madagascar/animal-registry";
import type {
  ApprovalKind,
  ApprovalRecord,
  ApprovalRisk,
  ApprovalStatus,
  DelegatedTask,
  DelegatedTaskStatus,
  LocalRuntimeDescriptor,
  WorkspacePermission,
} from "#/madagascar/contracts";
import {
  DEFAULT_MADAGASCAR_PROJECT_ROOT,
  getDefaultProjectState,
  readDesktopProjectState,
  readProjectState,
  writeProjectState,
} from "#/madagascar/project-state";

export interface ApprovalDetails {
  kind?: ApprovalKind;
  risk?: ApprovalRisk;
  sourceEventId?: string;
  preview?: string;
}

interface MadagascarStore {
  projectRoot: string;
  selectedAnimal: AnimalId;
  permission: WorkspacePermission;
  approvals: ApprovalRecord[];
  delegations: DelegatedTask[];
  conversationIds: string[];
  openFilePaths: string[];
  activeFilePath: string | null;
  runtime: LocalRuntimeDescriptor | null;
  setProjectRoot: (projectRoot: string) => void;
  hydrateProject: (projectRoot: string) => Promise<void>;
  setRuntime: (runtime: LocalRuntimeDescriptor | null) => void;
  setSelectedAnimal: (animal: AnimalId) => void;
  setPermission: (permission: WorkspacePermission) => void;
  setOpenFiles: (paths: string[], activePath?: string | null) => void;
  addConversation: (conversationId: string) => void;
  createApproval: (
    conversationId: string,
    summary: string,
    details?: ApprovalDetails,
  ) => string;
  updateApproval: (id: string, status: ApprovalStatus) => void;
  createDelegation: (
    conversationId: string,
    assignee: AnimalId,
    summary: string,
  ) => string;
  updateDelegation: (id: string, status: DelegatedTaskStatus) => void;
  resetProject: () => void;
}

const initialProjectState = readProjectState(DEFAULT_MADAGASCAR_PROJECT_ROOT);

type PersistedStore = Pick<
  MadagascarStore,
  | "projectRoot"
  | "selectedAnimal"
  | "permission"
  | "approvals"
  | "delegations"
  | "conversationIds"
  | "openFilePaths"
  | "activeFilePath"
>;

function saveState(state: PersistedStore): void {
  const {
    projectRoot,
    selectedAnimal,
    permission,
    approvals,
    delegations,
    conversationIds,
    openFilePaths,
    activeFilePath,
  } = state;
  writeProjectState({
    projectRoot,
    selectedAnimal,
    permission,
    approvals,
    delegations,
    conversationIds,
    openFilePaths,
    activeFilePath,
    updatedAt: new Date().toISOString(),
  });
}

function projectFields(state: ReturnType<typeof readProjectState>) {
  return {
    projectRoot: state.projectRoot,
    selectedAnimal: state.selectedAnimal,
    permission: state.permission,
    approvals: state.approvals,
    delegations: state.delegations,
    conversationIds: state.conversationIds,
    openFilePaths: state.openFilePaths,
    activeFilePath: state.activeFilePath,
  };
}

export const useMadagascarStore = create<MadagascarStore>((set, get) => ({
  ...projectFields(initialProjectState),
  runtime: null,

  setProjectRoot: (projectRoot) => {
    const next = readProjectState(projectRoot);
    set({ ...projectFields(next), runtime: null });
  },

  hydrateProject: async (projectRoot) => {
    const next = await readDesktopProjectState(projectRoot);
    if (next && get().projectRoot === projectRoot) {
      set({ ...projectFields(next), runtime: null });
    }
  },

  setRuntime: (runtime) => set({ runtime }),

  setSelectedAnimal: (selectedAnimal) => {
    set({ selectedAnimal });
    saveState(get());
  },

  setPermission: (permission) => {
    set({ permission });
    saveState(get());
  },

  setOpenFiles: (openFilePaths, activeFilePath = null) => {
    set({ openFilePaths, activeFilePath });
    saveState(get());
  },

  addConversation: (conversationId) => {
    const state = get();
    if (state.conversationIds.includes(conversationId)) return;
    set({ conversationIds: [...state.conversationIds, conversationId] });
    saveState(get());
  },

  createApproval: (conversationId, summary, details = {}) => {
    const now = new Date().toISOString();
    const approval: ApprovalRecord = {
      id: uuidv4(),
      conversationId,
      summary,
      status: "pending",
      kind: details.kind ?? "agent-action",
      risk: details.risk ?? "unknown",
      sourceEventId: details.sourceEventId,
      preview: details.preview,
      createdAt: now,
      updatedAt: now,
    };
    const state = get();
    set({ approvals: [...state.approvals, approval] });
    saveState(get());
    return approval.id;
  },

  updateApproval: (id, status) => {
    const approvals = get().approvals.map((approval) =>
      approval.id === id
        ? { ...approval, status, updatedAt: new Date().toISOString() }
        : approval,
    );
    set({ approvals });
    saveState(get());
  },

  createDelegation: (conversationId, assignee, summary) => {
    const now = new Date().toISOString();
    const task: DelegatedTask = {
      id: uuidv4(),
      conversationId,
      assignee,
      summary,
      status: "planned",
      createdAt: now,
      updatedAt: now,
    };
    const state = get();
    set({ delegations: [...state.delegations, task] });
    saveState(get());
    return task.id;
  },

  updateDelegation: (id, status) => {
    const delegations = get().delegations.map((task) =>
      task.id === id
        ? { ...task, status, updatedAt: new Date().toISOString() }
        : task,
    );
    set({ delegations });
    saveState(get());
  },

  resetProject: () => {
    const next = getDefaultProjectState(get().projectRoot);
    set({ ...projectFields(next), runtime: null });
    writeProjectState(next);
  },
}));
