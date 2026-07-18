import type { AnimalId } from "./animal-registry";
import type { ApprovalRecord, WorkspacePermission } from "./contracts";

export interface MadagascarProjectState {
  projectRoot: string;
  selectedAnimal: AnimalId;
  permission: WorkspacePermission;
  conversationIds: string[];
  approvals: ApprovalRecord[];
  updatedAt: string;
}

export const DEFAULT_MADAGASCAR_PROJECT_ROOT =
  import.meta.env.VITE_MADAGASCAR_WORKSPACE_ROOT?.trim() ||
  import.meta.env.VITE_WORKING_DIR?.trim() ||
  "workspace/project";

const DEFAULT_PROJECT_STATE: Omit<MadagascarProjectState, "projectRoot"> = {
  selectedAnimal: "lion",
  permission: "edit",
  conversationIds: [],
  approvals: [],
  updatedAt: new Date(0).toISOString(),
};

function storageKey(projectRoot: string): string {
  return `madagascar-project:${encodeURIComponent(projectRoot)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAnimalId(value: unknown): value is AnimalId {
  return (
    value === "lion" ||
    value === "elephant" ||
    value === "cheetah" ||
    value === "gorilla" ||
    value === "owl" ||
    value === "chameleon" ||
    value === "lemur" ||
    value === "zebra"
  );
}

function isPermission(value: unknown): value is WorkspacePermission {
  return (
    value === "read" ||
    value === "edit" ||
    value === "execute" ||
    value === "network" ||
    value === "unrestricted"
  );
}

export function getDefaultProjectState(
  projectRoot = DEFAULT_MADAGASCAR_PROJECT_ROOT,
): MadagascarProjectState {
  return { ...DEFAULT_PROJECT_STATE, projectRoot };
}

export function readProjectState(
  projectRoot = DEFAULT_MADAGASCAR_PROJECT_ROOT,
): MadagascarProjectState {
  const fallback = getDefaultProjectState(projectRoot);
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(storageKey(projectRoot));
    if (!raw) return fallback;
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value)) return fallback;

    return {
      ...fallback,
      projectRoot,
      selectedAnimal: isAnimalId(value.selectedAnimal)
        ? value.selectedAnimal
        : fallback.selectedAnimal,
      permission: isPermission(value.permission)
        ? value.permission
        : fallback.permission,
      conversationIds: Array.isArray(value.conversationIds)
        ? value.conversationIds.filter(
            (id): id is string => typeof id === "string",
          )
        : fallback.conversationIds,
      approvals: Array.isArray(value.approvals)
        ? (value.approvals.filter(isRecord) as unknown as ApprovalRecord[])
        : fallback.approvals,
      updatedAt:
        typeof value.updatedAt === "string"
          ? value.updatedAt
          : fallback.updatedAt,
    };
  } catch {
    return fallback;
  }
}

export function writeProjectState(state: MadagascarProjectState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      storageKey(state.projectRoot),
      JSON.stringify(state),
    );
  } catch {
    // Persistence is a convenience; the runtime must still work if storage is unavailable.
  }
}
