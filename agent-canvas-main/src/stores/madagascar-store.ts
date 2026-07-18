import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_ANIMAL_ID, type AnimalId } from "#/madagascar/animal-registry";
import type {
  ApprovalRecord,
  ApprovalStatus,
  LocalRuntimeDescriptor,
  WorkspacePermission,
} from "#/madagascar/contracts";
import {
  DEFAULT_MADAGASCAR_PROJECT_ROOT,
  getDefaultProjectState,
  readProjectState,
  writeProjectState,
} from "#/madagascar/project-state";

interface MadagascarStore {
  projectRoot: string;
  selectedAnimal: AnimalId;
  permission: WorkspacePermission;
  approvals: ApprovalRecord[];
  conversationIds: string[];
  runtime: LocalRuntimeDescriptor | null;
  setProjectRoot: (projectRoot: string) => void;
  setRuntime: (runtime: LocalRuntimeDescriptor | null) => void;
  setSelectedAnimal: (animal: AnimalId) => void;
  setPermission: (permission: WorkspacePermission) => void;
  addConversation: (conversationId: string) => void;
  createApproval: (conversationId: string, summary: string) => string;
  updateApproval: (id: string, status: ApprovalStatus) => void;
  resetProject: () => void;
}

const initialProjectState = readProjectState(DEFAULT_MADAGASCAR_PROJECT_ROOT);

function saveState(
  state: Pick<
    MadagascarStore,
    | "projectRoot"
    | "selectedAnimal"
    | "permission"
    | "approvals"
    | "conversationIds"
  >,
): void {
  writeProjectState({
    ...state,
    updatedAt: new Date().toISOString(),
  });
}

export const useMadagascarStore = create<MadagascarStore>((set, get) => ({
  projectRoot: initialProjectState.projectRoot,
  selectedAnimal: initialProjectState.selectedAnimal ?? DEFAULT_ANIMAL_ID,
  permission: initialProjectState.permission,
  approvals: initialProjectState.approvals,
  conversationIds: initialProjectState.conversationIds,
  runtime: null,

  setProjectRoot: (projectRoot) => {
    const next = readProjectState(projectRoot);
    set({
      projectRoot: next.projectRoot,
      selectedAnimal: next.selectedAnimal,
      permission: next.permission,
      approvals: next.approvals,
      conversationIds: next.conversationIds,
      runtime: null,
    });
  },

  setRuntime: (runtime) => set({ runtime }),

  setSelectedAnimal: (selectedAnimal) => {
    set({ selectedAnimal });
    const state = get();
    saveState(state);
  },

  setPermission: (permission) => {
    set({ permission });
    const state = get();
    saveState(state);
  },

  addConversation: (conversationId) => {
    const state = get();
    if (state.conversationIds.includes(conversationId)) return;
    const conversationIds = [...state.conversationIds, conversationId];
    set({ conversationIds });
    saveState({ ...state, conversationIds });
  },

  createApproval: (conversationId, summary) => {
    const now = new Date().toISOString();
    const approval: ApprovalRecord = {
      id: uuidv4(),
      conversationId,
      summary,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    const state = get();
    const approvals = [...state.approvals, approval];
    set({ approvals });
    saveState({ ...state, approvals });
    return approval.id;
  },

  updateApproval: (id, status) => {
    const state = get();
    const approvals = state.approvals.map((approval) =>
      approval.id === id
        ? { ...approval, status, updatedAt: new Date().toISOString() }
        : approval,
    );
    set({ approvals });
    saveState({ ...state, approvals });
  },

  resetProject: () => {
    const next = getDefaultProjectState(get().projectRoot);
    set({
      selectedAnimal: next.selectedAnimal,
      permission: next.permission,
      approvals: next.approvals,
      conversationIds: next.conversationIds,
    });
    writeProjectState(next);
  },
}));
