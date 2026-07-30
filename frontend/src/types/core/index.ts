import { MadagascarAction } from "./actions";
import { MadagascarObservation } from "./observations";
import { MadagascarVariance } from "./variances";

/**
 * @deprecated Will be removed once we fully transition to v1 events
 */
export type MadagascarParsedEvent =
  | MadagascarAction
  | MadagascarObservation
  | MadagascarVariance;
