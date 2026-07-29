import React from "react";
import { cn } from "#/utils/utils";
import { transformVSCodeUrl } from "#/utils/vscode-url-helper";
import ConversationService from "#/api/conversation-service/conversation-service.api";
import { V1SandboxStatus } from "#/api/sandbox-service/sandbox-service.types";
import { RepositorySelection } from "#/api/open-hands.types";
import { ConversationCardHeader } from "./conversation-card-header";
import { ConversationCardActions } from "./conversation-card-actions";
import { ConversationCardFooter } from "./conversation-card-footer";
import { SandboxStatusBadges } from "./sandbox-status-badges";
import { useDownloadConversation } from "#/hooks/use-download-conversation";
import type { AgentChip } from "#/utils/agent-display-label";
import { AnimalAvatar } from "#/components/shared/animal-avatar";

interface ConversationCardProps {
  onClick?: () => void;
  onDelete?: () => void;
  onStop?: () => void;
  onChangeTitle?: (title: string) => void;
  showOptions?: boolean;
  title: string;
  selectedRepository: RepositorySelection | null;
  lastUpdatedAt: string; // ISO 8601
  createdAt?: string; // ISO 8601
  sandboxStatus?: V1SandboxStatus;
  conversationId?: string; // Optional conversation ID for VS Code URL
  contextMenuOpen?: boolean;
  onContextMenuToggle?: (isOpen: boolean) => void;
  agentChip?: AgentChip | null;
}

export function ConversationCard({
  onClick,
  onDelete,
  onStop,
  onChangeTitle,
  showOptions,
  title,
  selectedRepository,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lastUpdatedAt,
  createdAt,
  conversationId,
  sandboxStatus,
  contextMenuOpen = false,
  onContextMenuToggle,
  agentChip,
}: ConversationCardProps) {
  const [titleMode, setTitleMode] = React.useState<"view" | "edit">("view");
  const { mutateAsync: downloadConversation } = useDownloadConversation();

  const onTitleSave = (newTitle: string) => {
    if (newTitle !== "" && newTitle !== title) {
      onChangeTitle?.(newTitle);
    }
    setTitleMode("view");
  };

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onDelete?.();
    onContextMenuToggle?.(false);
  };

  const handleStop = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onStop?.();
    onContextMenuToggle?.(false);
  };

  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setTitleMode("edit");
    onContextMenuToggle?.(false);
  };

  const handleDownloadViaVSCode = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (conversationId) {
      try {
        const data = await ConversationService.getVSCodeUrl(conversationId);
        if (data.vscode_url) {
          const transformedUrl = transformVSCodeUrl(data.vscode_url);
          if (transformedUrl) {
            window.open(transformedUrl, "_blank");
          }
        }
      } catch {
        // Failed
      }
    }

    onContextMenuToggle?.(false);
  };

  const handleDownloadConversation = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (conversationId) {
      await downloadConversation(conversationId);
    }
    onContextMenuToggle?.(false);
  };

  const hasContextMenu = !!(onDelete || onChangeTitle || showOptions);

  return (
    <div
      data-testid="conversation-card"
      data-context-menu-open={contextMenuOpen.toString()}
      onClick={onClick}
      className={cn(
        "relative h-auto w-full p-3.5 my-1.5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-white/20 shadow-md",
        "data-[context-menu-open=true]:bg-white/15",
      )}
    >
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <AnimalAvatar animal="owl" size="xs" showBadge={false} />
          <ConversationCardHeader
            title={title}
            titleMode={titleMode}
            onTitleSave={onTitleSave}
            sandboxStatus={sandboxStatus}
          />
          <SandboxStatusBadges sandboxStatus={sandboxStatus} />
        </div>

        {hasContextMenu && (
          <ConversationCardActions
            contextMenuOpen={contextMenuOpen}
            onContextMenuToggle={onContextMenuToggle || (() => {})}
            onDelete={onDelete && handleDelete}
            onStop={onStop && handleStop}
            onEdit={onChangeTitle && handleEdit}
            onDownloadViaVSCode={handleDownloadViaVSCode}
            onDownloadConversation={handleDownloadConversation}
            sandboxStatus={sandboxStatus}
            conversationId={conversationId}
            showOptions={showOptions}
          />
        )}
      </div>

      <ConversationCardFooter
        selectedRepository={selectedRepository}
        lastUpdatedAt={lastUpdatedAt}
        createdAt={createdAt}
        sandboxStatus={sandboxStatus}
        agentChip={agentChip}
      />
    </div>
  );
}
