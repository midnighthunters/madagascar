export const MADAGASCAR_PRODUCT_NAME = "Madagascar";

export type WorkspacePermission =
  | "read"
  | "edit"
  | "execute"
  | "network"
  | "unrestricted";

export type RuntimeStatus =
  | "stopped"
  | "starting"
  | "ready"
  | "stopping"
  | "crashed";

export type ApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "applied"
  | "undone";

export type AgentCapability =
  | "plan"
  | "read-context"
  | "edit-files"
  | "run-commands"
  | "review-diffs"
  | "adapt-integrations"
  | "manage-release";

export interface WorkspacePolicy {
  root: string;
  permission: WorkspacePermission;
  allowOutsideRoot: boolean;
}

export interface LocalRuntimeDescriptor {
  host: string;
  port: number;
  sessionApiKey: string;
  workspace: WorkspacePolicy;
  sdkRoot: string;
  status: RuntimeStatus;
  pid?: number;
}

export interface ApprovalRecord {
  id: string;
  conversationId: string;
  summary: string;
  status: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
}
