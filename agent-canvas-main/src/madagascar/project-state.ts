import type { AnimalId } from "./animal-registry";
import {
  canUseMadagascarDesktopBridge,
  invokeMadagascarDesktop,
} from "./desktop-bridge";
import type {
  ApprovalRecord,
  DelegatedTask,
  WorkspacePermission,
} from "./contracts";

export interface MadagascarProjectState {
  projectRoot: string;
  selectedAnimal: AnimalId;
  permission: WorkspacePermission;
  conversationIds: string[];
  approvals: ApprovalRecord[];
  delegations: DelegatedTask[];
  openFilePaths: string[];
  activeFilePath: string | null;
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
  delegations: [],
  openFilePaths: [],
  activeFilePath: null,
  updatedAt: new Date(0).toISOString(),
};

function storageKey(projectRoot: string): string {
  return `madagascar-project:${encodeURIComponent(projectRoot)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAnimalId(value: unknown): value is AnimalId {
  return [
    "lion",
    "elephant",
    "cheetah",
    "gorilla",
    "owl",
    "chameleon",
    "lemur",
    "zebra",
  ].includes(value as string);
}

function isPermission(value: unknown): value is WorkspacePermission {
  return ["read", "edit", "execute", "network", "unrestricted"].includes(
    value as string,
  );
}

function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function approval(value: unknown): ApprovalRecord | null {
  if (!isRecord(value) || typeof value.id !== "string") return null;
  if (
    typeof value.conversationId !== "string" ||
    typeof value.summary !== "string"
  ) {
    return null;
  }
  const status = value.status;
  if (
    !["pending", "approved", "rejected", "applied", "undone"].includes(
      status as string,
    )
  ) {
    return null;
  }
  return {
    id: value.id,
    conversationId: value.conversationId,
    summary: value.summary,
    status: status as ApprovalRecord["status"],
    kind: ["plan", "edit", "command", "agent-action"].includes(
      value.kind as string,
    )
      ? (value.kind as ApprovalRecord["kind"])
      : "agent-action",
    risk: ["low", "medium", "high", "unknown"].includes(value.risk as string)
      ? (value.risk as ApprovalRecord["risk"])
      : "unknown",
    sourceEventId:
      typeof value.sourceEventId === "string" ? value.sourceEventId : undefined,
    preview: typeof value.preview === "string" ? value.preview : undefined,
    createdAt:
      typeof value.createdAt === "string"
        ? value.createdAt
        : new Date(0).toISOString(),
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : new Date(0).toISOString(),
  };
}

function delegation(value: unknown): DelegatedTask | null {
  if (!isRecord(value) || typeof value.id !== "string") return null;
  if (
    typeof value.conversationId !== "string" ||
    typeof value.assignee !== "string" ||
    typeof value.summary !== "string"
  ) {
    return null;
  }
  if (
    !["planned", "running", "cancelled", "failed", "completed"].includes(
      value.status as string,
    )
  ) {
    return null;
  }
  return {
    id: value.id,
    conversationId: value.conversationId,
    assignee: value.assignee,
    summary: value.summary,
    status: value.status as DelegatedTask["status"],
    createdAt:
      typeof value.createdAt === "string"
        ? value.createdAt
        : new Date(0).toISOString(),
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : new Date(0).toISOString(),
  };
}

export function getDefaultProjectState(
  projectRoot = DEFAULT_MADAGASCAR_PROJECT_ROOT,
): MadagascarProjectState {
  return { ...DEFAULT_PROJECT_STATE, projectRoot };
}

function parseProjectState(
  value: unknown,
  projectRoot: string,
): MadagascarProjectState {
  const fallback = getDefaultProjectState(projectRoot);
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
    conversationIds: strings(value.conversationIds),
    approvals: Array.isArray(value.approvals)
      ? value.approvals
          .map(approval)
          .filter((item): item is ApprovalRecord => item !== null)
      : [],
    delegations: Array.isArray(value.delegations)
      ? value.delegations
          .map(delegation)
          .filter((item): item is DelegatedTask => item !== null)
      : [],
    openFilePaths: strings(value.openFilePaths),
    activeFilePath:
      typeof value.activeFilePath === "string" ? value.activeFilePath : null,
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : fallback.updatedAt,
  };
}

export function readProjectState(
  projectRoot = DEFAULT_MADAGASCAR_PROJECT_ROOT,
): MadagascarProjectState {
  if (typeof window === "undefined") return getDefaultProjectState(projectRoot);
  try {
    return parseProjectState(
      JSON.parse(
        window.localStorage.getItem(storageKey(projectRoot)) || "null",
      ),
      projectRoot,
    );
  } catch {
    return getDefaultProjectState(projectRoot);
  }
}

export async function readDesktopProjectState(
  projectRoot: string,
): Promise<MadagascarProjectState | null> {
  if (!canUseMadagascarDesktopBridge()) return null;
  try {
    const stored = await invokeMadagascarDesktop<unknown>(
      "read_project_state",
      {
        workspaceRoot: projectRoot,
      },
    );
    return stored === null ? null : parseProjectState(stored, projectRoot);
  } catch {
    return null;
  }
}

export function writeProjectState(state: MadagascarProjectState): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        storageKey(state.projectRoot),
        JSON.stringify(state),
      );
    } catch {
      // Browser storage is a development fallback; desktop storage is authoritative.
    }
  }
  if (canUseMadagascarDesktopBridge()) {
    void invokeMadagascarDesktop("write_project_state", {
      request: { workspaceRoot: state.projectRoot, state },
    });
  }
}
