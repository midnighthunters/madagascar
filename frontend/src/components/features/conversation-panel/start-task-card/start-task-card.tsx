import { useTranslation } from "react-i18next";
import type { V1AppConversationStartTask } from "#/api/conversation-service/v1-conversation-service.types";
import { cn } from "#/utils/utils";
import { I18nKey } from "#/i18n/declaration";
import { StartTaskCardHeader } from "./start-task-card-header";
import { StartTaskCardFooter } from "./start-task-card-footer";
import { AnimalAvatar } from "#/components/shared/animal-avatar";

interface StartTaskCardProps {
  task: V1AppConversationStartTask;
  onClick?: () => void;
}

export function StartTaskCard({ task, onClick }: StartTaskCardProps) {
  const { t } = useTranslation();
  const title =
    task.request.title ||
    task.detail ||
    t(I18nKey.CONVERSATION$STARTING_CONVERSATION);

  const selectedRepository = task.request.selected_repository
    ? {
        selected_repository: task.request.selected_repository,
        selected_branch: task.request.selected_branch || null,
        git_provider: task.request.git_provider || null,
      }
    : null;

  return (
    <div
      data-testid="start-task-card"
      onClick={onClick}
      className={cn(
        "relative h-auto w-full p-3.5 my-1.5 rounded-2xl backdrop-blur-xl bg-amber-500/10 border border-amber-400/30 cursor-pointer transition-all duration-200 hover:bg-amber-500/20 shadow-lg",
      )}
    >
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <AnimalAvatar animal="rabbit" size="xs" status="executing" />
          <StartTaskCardHeader title={title} taskStatus={task.status} />
        </div>
      </div>

      <StartTaskCardFooter
        selectedRepository={selectedRepository}
        createdAt={task.created_at}
        detail={task.detail}
      />
    </div>
  );
}
