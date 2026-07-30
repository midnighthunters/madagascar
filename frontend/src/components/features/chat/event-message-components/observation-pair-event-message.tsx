import React from "react";
import { MadagascarAction } from "#/types/core/actions";
import { isMadagascarAction } from "#/types/core/guards";
import { ChatMessage } from "../chat-message";

const hasThoughtProperty = (
  obj: Record<string, unknown>,
): obj is { thought: string } => "thought" in obj && !!obj.thought;

interface ObservationPairEventMessageProps {
  event: MadagascarAction;
}

export function ObservationPairEventMessage({
  event,
}: ObservationPairEventMessageProps) {
  if (!isMadagascarAction(event)) {
    return null;
  }

  if (hasThoughtProperty(event.args) && event.action !== "think") {
    return (
      <div>
        <ChatMessage type="agent" message={event.args.thought} />
      </div>
    );
  }

  return null;
}
