import { getAnimalAgent, type AnimalId } from "./animal-registry";
import type { AgentCapability } from "./contracts";

export type MadagascarAction =
  | "conversation"
  | "plan"
  | "edit"
  | "command"
  | "review"
  | "delegate";

const ACTION_CAPABILITY: Record<MadagascarAction, AgentCapability | null> = {
  conversation: null,
  plan: "plan",
  edit: "edit-files",
  command: "run-commands",
  review: "review-diffs",
  delegate: "plan",
};

/** Keep UI affordances aligned with the animal registry's declared role. */
export function canAnimalPerform(
  animalId: AnimalId,
  action: MadagascarAction,
): boolean {
  const required = ACTION_CAPABILITY[action];
  return (
    required === null ||
    getAnimalAgent(animalId).capabilities.includes(required)
  );
}

export function describeAnimalPermissions(animalId: AnimalId): string {
  const animal = getAnimalAgent(animalId);
  return `${animal.name}: ${animal.capabilities.join(", ")}`;
}
