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

export type ApprovalRisk = "low" | "medium" | "high" | "unknown";

export type ApprovalKind = "plan" | "edit" | "command" | "agent-action";

export type DelegatedTaskStatus =
  | "planned"
  | "running"
  | "cancelled"
  | "failed"
  | "completed";

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
  kind: ApprovalKind;
  risk: ApprovalRisk;
  sourceEventId?: string;
  preview?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DelegatedTask {
  id: string;
  conversationId: string;
  assignee: string;
  summary: string;
  status: DelegatedTaskStatus;
  createdAt: string;
  updatedAt: string;
}
