export type MadagascarEventType =
  | "message"
  | "system"
  | "agent_state_changed"
  | "change_agent_state"
  | "run"
  | "read"
  | "write"
  | "edit"
  | "run_ipython"
  | "delegate"
  | "browse"
  | "browse_interactive"
  | "reject"
  | "think"
  | "finish"
  | "error"
  | "recall"
  | "mcp"
  | "call_tool_mcp"
  | "task_tracking"
  | "user_rejected";

export type MadagascarSourceType = "agent" | "user" | "environment" | "hook";

interface MadagascarBaseEvent {
  id: number;
  source: MadagascarSourceType;
  message: string;
  timestamp: string; // ISO 8601
}

export interface MadagascarActionEvent<
  T extends MadagascarEventType,
> extends MadagascarBaseEvent {
  action: T;
  args: Record<string, unknown>;
}

export interface MadagascarObservationEvent<
  T extends MadagascarEventType,
> extends MadagascarBaseEvent {
  cause: number;
  observation: T;
  content: string;
  extras: Record<string, unknown>;
}
