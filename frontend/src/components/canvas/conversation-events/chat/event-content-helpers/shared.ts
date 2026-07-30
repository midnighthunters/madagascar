import { MadagascarEvent } from "#/types/agent-server/core";

export const MAX_CONTENT_LENGTH = 1000;

export const getDefaultEventContent = (event: MadagascarEvent): string =>
  `\`\`\`json\n${JSON.stringify(event, null, 2)}\n\`\`\``;
