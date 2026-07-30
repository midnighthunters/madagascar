import { MadagascarAction } from "#/types/core/actions";
import { MadagascarEventType } from "#/types/core/base";
import {
  isCommandAction,
  isCommandObservation,
  isMadagascarAction,
  isMadagascarObservation,
} from "#/types/core/guards";
import { MadagascarObservation } from "#/types/core/observations";

const COMMON_NO_RENDER_LIST: MadagascarEventType[] = [
  "system",
  "agent_state_changed",
  "change_agent_state",
];

const ACTION_NO_RENDER_LIST: MadagascarEventType[] = ["recall"];

const OBSERVATION_NO_RENDER_LIST: MadagascarEventType[] = ["think"];

export const shouldRenderEvent = (
  event: MadagascarAction | MadagascarObservation,
) => {
  if (isMadagascarAction(event)) {
    if (isCommandAction(event) && event.source === "user") {
      // For user commands, we always hide them from the chat interface
      return false;
    }

    const noRenderList = COMMON_NO_RENDER_LIST.concat(ACTION_NO_RENDER_LIST);
    return !noRenderList.includes(event.action);
  }

  if (isMadagascarObservation(event)) {
    if (isCommandObservation(event) && event.source === "user") {
      // For user commands, we always hide them from the chat interface
      return false;
    }

    const noRenderList = COMMON_NO_RENDER_LIST.concat(
      OBSERVATION_NO_RENDER_LIST,
    );
    return !noRenderList.includes(event.observation);
  }

  return true;
};

export const hasUserEvent = (
  events: (MadagascarAction | MadagascarObservation)[],
) =>
  events.some((event) => isMadagascarAction(event) && event.source === "user");
