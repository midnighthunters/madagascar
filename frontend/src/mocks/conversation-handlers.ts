import { http, delay, HttpResponse } from "msw";
import {
  Conversation,
  GetMicroagentsResponse,
  ResultSet,
} from "#/api/open-hands.types";
import {
  V1AppConversation,
  V1AppConversationStartTask,
  V1AppConversationStartRequest,
} from "#/api/conversation-service/v1-conversation-service.types";
import { V1ExecutionStatus } from "#/types/v1/core/base/common";

const conversations: Conversation[] = [
  {
    conversation_id: "1",
    title: "My New Project",
    selected_repository: null,
    git_provider: null,
    selected_branch: null,
    last_updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    status: "RUNNING",
    runtime_status: "STATUS$READY",
    url: null,
    session_api_key: null,
  },
  {
    conversation_id: "2",
    title: "Repo Testing",
    selected_repository: "octocat/hello-world",
    git_provider: "github",
    selected_branch: null,
    last_updated_at: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "STOPPED",
    runtime_status: null,
    url: null,
    session_api_key: null,
  },
  {
    conversation_id: "3",
    title: "Another Project",
    selected_repository: "octocat/earth",
    git_provider: null,
    selected_branch: "main",
    last_updated_at: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "STOPPED",
    runtime_status: null,
    url: null,
    session_api_key: null,
  },
];

const CONVERSATIONS = new Map<string, Conversation>(
  conversations.map((c) => [c.conversation_id, c]),
);

const v1Conversations: V1AppConversation[] = [
  {
    id: "1",
    created_by_user_id: "user-1",
    sandbox_id: "sandbox-1",
    selected_repository: null,
    selected_branch: null,
    git_provider: null,
    title: "My New Project",
    trigger: null,
    pr_number: [],
    llm_model: "gpt-4o",
    metrics: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sandbox_status: "RUNNING",
    execution_status: V1ExecutionStatus.PAUSED,
    conversation_url: null,
    session_api_key: null,
    sub_conversation_ids: [],
  },
];

const V1_CONVERSATIONS = new Map<string, V1AppConversation>(
  v1Conversations.map((c) => [c.id, c]),
);

const START_TASKS = new Map<string, V1AppConversationStartTask>();

export const CONVERSATION_HANDLERS = [
  http.get("/api/conversations", async () => {
    const values = Array.from(CONVERSATIONS.values());
    const results: ResultSet<Conversation> = {
      results: values,
      next_page_id: null,
    };
    return HttpResponse.json(results);
  }),

  http.get("/api/conversations/:conversationId", async ({ params }) => {
    const conversationId = params.conversationId as string;
    const project = CONVERSATIONS.get(conversationId);
    if (project) return HttpResponse.json(project);
    return HttpResponse.json(null, { status: 404 });
  }),

  http.post("/api/conversations", async () => {
    await delay();
    const conversation: Conversation = {
      conversation_id: (Math.random() * 100).toString(),
      title: "New Conversation",
      selected_repository: null,
      git_provider: null,
      selected_branch: null,
      last_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      status: "RUNNING",
      runtime_status: "STATUS$READY",
      url: null,
      session_api_key: null,
    };
    CONVERSATIONS.set(conversation.conversation_id, conversation);
    return HttpResponse.json(conversation, { status: 201 });
  }),

  http.patch(
    "/api/conversations/:conversationId",
    async ({ params, request }) => {
      const conversationId = params.conversationId as string;
      const conversation = CONVERSATIONS.get(conversationId);

      if (conversation) {
        const body = await request.json();
        if (typeof body === "object" && body?.title) {
          CONVERSATIONS.set(conversationId, {
            ...conversation,
            title: body.title,
          });
          return HttpResponse.json(null, { status: 200 });
        }
      }
      return HttpResponse.json(null, { status: 404 });
    },
  ),

  http.delete("/api/conversations/:conversationId", async ({ params }) => {
    const conversationId = params.conversationId as string;
    if (CONVERSATIONS.has(conversationId)) {
      CONVERSATIONS.delete(conversationId);
      return HttpResponse.json(null, { status: 200 });
    }
    return HttpResponse.json(null, { status: 404 });
  }),

  http.post(
    "/api/v1/conversations/:conversationId/pending-messages",
    async () => HttpResponse.json({ id: "mock-pending-id", position: 0 }),
  ),

  http.post("/api/v1/app-conversations", async ({ request }) => {
    await delay();
    const reqBody = (await request
      .json()
      .catch(() => ({}))) as V1AppConversationStartRequest;
    const conversationId = Math.floor(Math.random() * 1000).toString();
    const taskId = `task-mock-${conversationId}`;

    const conversation: V1AppConversation = {
      id: conversationId,
      created_by_user_id: "user-1",
      sandbox_id: "sandbox-1",
      selected_repository: reqBody?.selected_repository || null,
      selected_branch: reqBody?.selected_branch || null,
      git_provider: reqBody?.git_provider || null,
      title: reqBody?.title || "New Conversation",
      trigger: reqBody?.trigger || null,
      pr_number: reqBody?.pr_number || [],
      llm_model: reqBody?.llm_model || "gpt-4o",
      metrics: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sandbox_status: "RUNNING",
      execution_status: V1ExecutionStatus.PAUSED,
      conversation_url: null,
      session_api_key: null,
      sub_conversation_ids: [],
    };
    V1_CONVERSATIONS.set(conversationId, conversation);

    const startTask: V1AppConversationStartTask = {
      id: taskId,
      created_by_user_id: "user-1",
      status: "READY",
      detail: null,
      app_conversation_id: conversationId,
      sandbox_id: "sandbox-1",
      agent_server_url: null,
      request: reqBody,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    START_TASKS.set(taskId, startTask);

    return HttpResponse.json(startTask, { status: 201 });
  }),

  http.get("/api/v1/app-conversations/start-tasks", async ({ request }) => {
    const url = new URL(request.url);
    const ids = url.searchParams.getAll("ids");
    const tasks = ids.map((id) => START_TASKS.get(id) || null);
    return HttpResponse.json(tasks);
  }),

  http.get("/api/v1/app-conversations/start-tasks/search", async () => {
    return HttpResponse.json({
      items: Array.from(START_TASKS.values()),
      next_page_id: null,
    });
  }),

  http.get("/api/v1/app-conversations/search", async () => {
    return HttpResponse.json({
      items: Array.from(V1_CONVERSATIONS.values()),
      next_page_id: null,
    });
  }),

  http.get("/api/v1/app-conversations", async ({ request }) => {
    const url = new URL(request.url);
    const ids = url.searchParams.getAll("ids");
    const result = ids.map((id) => V1_CONVERSATIONS.get(id) || null);
    return HttpResponse.json(result);
  }),

  http.get("/api/v1/app-conversations/:id", async ({ params }) => {
    const id = params.id as string;
    const conversation = V1_CONVERSATIONS.get(id);
    if (conversation) return HttpResponse.json(conversation);
    return HttpResponse.json(null, { status: 404 });
  }),

  http.get("/api/conversations/:conversationId/microagents", async () => {
    const response: GetMicroagentsResponse = {
      microagents: [
        {
          name: "init",
          type: "agentskills",
          content: "Initialize an AGENTS.md file for the repository",
          triggers: ["/init"],
        },
        {
          name: "releasenotes",
          type: "agentskills",
          content: "Generate a changelog from the most recent release",
          triggers: ["/releasenotes"],
        },
        {
          name: "test-runner",
          type: "agentskills",
          content: "Run the test suite and report results",
          triggers: ["/test"],
        },
        {
          name: "code-search",
          type: "knowledge",
          content: "Search the codebase semantically",
          triggers: ["/search"],
        },
        {
          name: "docker",
          type: "agentskills",
          content: "Docker usage guide for container environments",
          triggers: ["docker", "container"],
        },
        {
          name: "github",
          type: "agentskills",
          content: "GitHub API interaction guide",
          triggers: ["github", "git"],
        },
        {
          name: "work_hosts",
          type: "repo",
          content: "Available hosts for web applications",
          triggers: [],
        },
      ],
    };
    return HttpResponse.json(response);
  }),
];
