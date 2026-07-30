import { MadagascarParsedEvent } from ".";
import {
  UserMessageAction,
  AssistantMessageAction,
  MadagascarAction,
  SystemMessageAction,
  CommandAction,
  FinishAction,
  TaskTrackingAction,
} from "./actions";
import {
  AgentStateChangeObservation,
  CommandObservation,
  ErrorObservation,
  MCPObservation,
  MadagascarObservation,
  TaskTrackingObservation,
} from "./observations";
import { StatusUpdate } from "./variances";

export const isMadagascarEvent = (
  event: unknown,
): event is MadagascarParsedEvent =>
  typeof event === "object" &&
  event !== null &&
  "id" in event &&
  "source" in event &&
  "message" in event &&
  "timestamp" in event;

export const isMadagascarAction = (
  event: MadagascarParsedEvent,
): event is MadagascarAction => "action" in event;

export const isMadagascarObservation = (
  event: MadagascarParsedEvent,
): event is MadagascarObservation => "observation" in event;

export const isUserMessage = (
  event: MadagascarParsedEvent,
): event is UserMessageAction =>
  isMadagascarAction(event) &&
  event.source === "user" &&
  event.action === "message";

export const isAssistantMessage = (
  event: MadagascarParsedEvent,
): event is AssistantMessageAction =>
  isMadagascarAction(event) &&
  event.source === "agent" &&
  (event.action === "message" || event.action === "finish");

export const isErrorObservation = (
  event: MadagascarParsedEvent,
): event is ErrorObservation =>
  isMadagascarObservation(event) && event.observation === "error";

export const isCommandAction = (
  event: MadagascarParsedEvent,
): event is CommandAction => isMadagascarAction(event) && event.action === "run";

export const isAgentStateChangeObservation = (
  event: MadagascarParsedEvent,
): event is AgentStateChangeObservation =>
  isMadagascarObservation(event) && event.observation === "agent_state_changed";

export const isCommandObservation = (
  event: MadagascarParsedEvent,
): event is CommandObservation =>
  isMadagascarObservation(event) && event.observation === "run";

export const isFinishAction = (
  event: MadagascarParsedEvent,
): event is FinishAction =>
  isMadagascarAction(event) && event.action === "finish";

export const isSystemMessage = (
  event: MadagascarParsedEvent,
): event is SystemMessageAction =>
  isMadagascarAction(event) && event.action === "system";

export const isRejectObservation = (
  event: MadagascarParsedEvent,
): event is MadagascarObservation =>
  isMadagascarObservation(event) && event.observation === "user_rejected";

export const isMcpObservation = (
  event: MadagascarParsedEvent,
): event is MCPObservation =>
  isMadagascarObservation(event) && event.observation === "mcp";

export const isTaskTrackingAction = (
  event: MadagascarParsedEvent,
): event is TaskTrackingAction =>
  isMadagascarAction(event) && event.action === "task_tracking";

export const isTaskTrackingObservation = (
  event: MadagascarParsedEvent,
): event is TaskTrackingObservation =>
  isMadagascarObservation(event) && event.observation === "task_tracking";

export const isStatusUpdate = (event: unknown): event is StatusUpdate =>
  typeof event === "object" &&
  event !== null &&
  "status_update" in event &&
  "type" in event &&
  "id" in event;

export const isActionOrObservation = (
  event: MadagascarParsedEvent,
): event is MadagascarAction | MadagascarObservation =>
  isMadagascarAction(event) || isMadagascarObservation(event);
