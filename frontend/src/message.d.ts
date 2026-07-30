import { MadagascarObservation } from "./types/core/observations";
import { MadagascarAction } from "./types/core/actions";

export type Message = {
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  imageUrls?: string[];
  type?: "thought" | "error" | "action";
  success?: boolean;
  pending?: boolean;
  translationID?: string;
  eventID?: number;
  observation?: { payload: MadagascarObservation };
  action?: { payload: MadagascarAction };
};
