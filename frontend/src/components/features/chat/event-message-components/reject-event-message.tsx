import React from "react";
import { MadagascarObservation } from "#/types/core/observations";
import { isRejectObservation } from "#/types/core/guards";
import { ChatMessage } from "../chat-message";

interface RejectEventMessageProps {
  event: MadagascarObservation;
}

export function RejectEventMessage({ event }: RejectEventMessageProps) {
  if (!isRejectObservation(event)) {
    return null;
  }

  return (
    <div>
      <ChatMessage type="agent" message={event.content} />
    </div>
  );
}
