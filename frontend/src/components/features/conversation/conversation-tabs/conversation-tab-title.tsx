import { useTranslation } from "react-i18next";
import RefreshIcon from "#/icons/u-refresh.svg?react";
import { useUnifiedGetGitChanges } from "#/hooks/query/use-unified-get-git-changes";
import { useHandleBuildPlanClick } from "#/hooks/use-handle-build-plan-click";
import { useAgentState } from "#/hooks/use-agent-state";
import { useConversationStore } from "#/stores/conversation-store";
import { AgentState } from "#/types/agent-state";
import { I18nKey } from "#/i18n/declaration";
import { cn } from "#/utils/utils";
import { Typography } from "#/ui/typography";
import { Button } from "#/ui/button";

type ConversationTabTitleProps = {
  title: string;
  conversationKey: string;
};

/* eslint-disable i18next/no-literal-string */
export function ConversationTabTitle({
  title,
  conversationKey,
}: ConversationTabTitleProps) {
  const { t } = useTranslation();
  const { refetch, isFetching } = useUnifiedGetGitChanges();
  const { handleBuildPlanClick } = useHandleBuildPlanClick();
  const { curAgentState } = useAgentState();
  const { planContent } = useConversationStore();

  const handleRefresh = () => {
    refetch();
  };

  // Determine if Build button should be disabled
  const isAgentRunning =
    curAgentState === AgentState.RUNNING ||
    curAgentState === AgentState.LOADING;
  const isBuildDisabled = isAgentRunning || !planContent;

  return (
    <div className="flex flex-row items-center justify-between border-b border-line bg-[var(--md-editor-raised)] py-2 px-3">
      <span className="text-xs font-medium text-ink">{title}</span>
      {conversationKey === "editor" && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={handleRefresh}
          disabled={isFetching}
        >
          <RefreshIcon
            width={12.75}
            height={15}
            className={isFetching ? "animate-spin" : ""}
          />
        </Button>
      )}
      {conversationKey === "planner" && (
        <Button
          type="button"
          variant="primary"
          size="compact"
          onClick={handleBuildPlanClick}
          disabled={isBuildDisabled}
          className={cn(
            "min-w-20",
            isBuildDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-90 cursor-pointer",
          )}
          data-testid="planner-tab-build-button"
        >
          <Typography.Text className="text-ink-inverse text-[11px] font-medium leading-5">
            {t(I18nKey.COMMON$BUILD)} ⌘↩
          </Typography.Text>
        </Button>
      )}
    </div>
  );
}
