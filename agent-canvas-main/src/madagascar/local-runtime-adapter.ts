import type {
  AppConversationStartTask,
  MessageContent,
} from "#/api/conversation-service/agent-server-conversation-service.types";
import AgentServerConversationService from "#/api/conversation-service/agent-server-conversation-service.api";
import AgentServerRuntimeService from "#/api/runtime-service/agent-server-runtime-service";
import EventService from "#/api/event-service/event-service.api";
import type { AnimalId } from "./animal-registry";
import { DEFAULT_ANIMAL_ID, getAnimalAgent } from "./animal-registry";
import type {
  ApprovalRecord,
  LocalRuntimeDescriptor,
  WorkspacePermission,
} from "./contracts";

export interface MadagascarConversationOptions {
  animalId?: AnimalId;
  initialMessage?: string;
  conversationInstructions?: string;
  workspaceRoot?: string;
  parentConversationId?: string;
}

export interface MadagascarCommandResult {
  exit_code: number;
  stdout: string;
  stderr: string;
}

/**
 * Local-only application boundary. UI code uses this facade instead of
 * branching on the legacy local/cloud backend registry.
 */
export class MadagascarLocalRuntimeAdapter {
  static buildAgentInstructions(
    animalId: AnimalId = DEFAULT_ANIMAL_ID,
    instructions?: string,
  ): string {
    const animal = getAnimalAgent(animalId);
    return [
      `You are ${animal.name}, the Madagascar ${animal.role}.`,
      animal.systemPrompt,
      instructions?.trim(),
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  static async createConversation(
    options: MadagascarConversationOptions = {},
  ): Promise<AppConversationStartTask> {
    const agentInstructions = this.buildAgentInstructions(
      options.animalId,
      options.conversationInstructions,
    );

    return AgentServerConversationService.createConversation(
      options.initialMessage,
      agentInstructions,
      undefined,
      null,
      options.workspaceRoot,
      "local_repo",
      options.parentConversationId,
    );
  }

  static sendMessage(
    conversationId: string,
    content: string,
  ): Promise<unknown> {
    const message: { role: "user"; content: MessageContent[] } = {
      role: "user",
      content: [{ type: "text", text: content }],
    };
    return AgentServerConversationService.sendMessage(conversationId, message);
  }

  static executeCommand(
    command: string,
    cwd?: string,
    timeout = 30,
  ): Promise<MadagascarCommandResult> {
    return AgentServerRuntimeService.executeCommand(
      null,
      null,
      command,
      cwd,
      timeout,
    );
  }

  static respondToApproval(
    conversationId: string,
    conversationUrl: string,
    request: Parameters<typeof EventService.respondToConfirmation>[2],
    sessionApiKey?: string | null,
  ) {
    return EventService.respondToConfirmation(
      conversationId,
      conversationUrl,
      request,
      sessionApiKey,
    );
  }
}

export interface MadagascarLocalRuntimeConfig {
  descriptor: LocalRuntimeDescriptor | null;
  permission: WorkspacePermission;
  pendingApprovals: ApprovalRecord[];
}
