import { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import LessonPlanIcon from "#/icons/lesson-plan.svg?react";
import { Typography } from "#/ui/typography";
import { I18nKey } from "#/i18n/declaration";
import { MarkdownRenderer } from "#/components/features/markdown/markdown-renderer";
import { useHandleBuildPlanClick } from "#/hooks/use-handle-build-plan-click";
import { cn } from "#/utils/utils";
import { useSelectConversationTab } from "#/hooks/use-select-conversation-tab";
import {
  planComponents,
  createPlanComponents,
} from "#/components/features/markdown/plan-components";
import { useScrollContext } from "#/context/scroll-context";
import { Button } from "#/ui/button";

const MAX_CONTENT_LENGTH = 300;

// Shine effect class for streaming text
const SHINE_TEXT_CLASS = "shine-text";

// Plan components with shine effect applied for streaming state
const shineComponents = createPlanComponents(SHINE_TEXT_CLASS);

interface PlanPreviewProps {
  /** Raw plan content from PLAN.md file */
  planContent?: string | null;
  /** Whether the plan content is actively being streamed */
  isStreaming?: boolean;
  /** Whether the Build button should be disabled (e.g., while streaming) */
  isBuildDisabled?: boolean;
}

/* eslint-disable i18next/no-literal-string */
export function PlanPreview({
  planContent,
  isStreaming,
  isBuildDisabled,
}: PlanPreviewProps) {
  const { t } = useTranslation();
  const { navigateToTab } = useSelectConversationTab();
  const { handleBuildPlanClick } = useHandleBuildPlanClick();
  const { scrollDomToBottom } = useScrollContext();

  const handleViewClick = () => {
    navigateToTab("planner");
  };

  // Handle Build action with scroll to bottom
  const handleBuildClick = useCallback(
    (event?: React.MouseEvent<HTMLButtonElement>) => {
      handleBuildPlanClick(event);
      scrollDomToBottom();
    },
    [handleBuildPlanClick, scrollDomToBottom],
  );

  // Truncate plan content for preview
  const truncatedContent = useMemo(() => {
    if (!planContent) return "";
    if (planContent.length <= MAX_CONTENT_LENGTH) return planContent;
    return `${planContent.slice(0, MAX_CONTENT_LENGTH)}...`;
  }, [planContent]);

  if (!planContent) {
    return null;
  }

  return (
    <div className="mt-2 w-full rounded-[16px] border border-[var(--md-planning-border)] bg-planning-bubble text-ink shadow-[var(--md-shadow-card)]">
      {/* Header */}
      <div className="border-b border-line flex h-[41px] items-center px-3 gap-1">
        <LessonPlanIcon width={18} height={18} className="text-ink-secondary" />
        <Typography.Text className="font-medium text-[11px] text-ink tracking-[0.11px] leading-4">
          {t(I18nKey.COMMON$PLAN_MD)}
        </Typography.Text>
        <div className="flex-1" />
        <Button
          type="button"
          onClick={handleViewClick}
          variant="ghost"
          size="compact"
          className="h-7 px-2"
          data-testid="plan-preview-view-button"
        >
          <Typography.Text className="font-medium text-[11px] text-ink tracking-[0.11px] leading-4">
            {t(I18nKey.COMMON$VIEW)}
          </Typography.Text>
          <ArrowUpRight size={18} />
        </Button>
      </div>

      {/* Content */}
      <div
        data-testid="plan-preview-content"
        className="flex flex-col gap-[10px] p-4 text-[15px] text-ink leading-[29px]"
      >
        {truncatedContent && (
          <>
            <MarkdownRenderer
              includeStandard
              components={isStreaming ? shineComponents : planComponents}
            >
              {truncatedContent}
            </MarkdownRenderer>
            {planContent && planContent.length > MAX_CONTENT_LENGTH && (
              <button
                type="button"
                onClick={handleViewClick}
                className="text-action cursor-pointer hover:underline text-left"
                data-testid="plan-preview-read-more-button"
              >
                {t(I18nKey.COMMON$READ_MORE)}
              </button>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-line flex h-[58px] items-center justify-start px-4">
        <Button
          type="button"
          onClick={handleBuildClick}
          disabled={isBuildDisabled}
          variant="primary"
          size="compact"
          className={cn(
            "min-w-[104px]",
            isBuildDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-90 cursor-pointer",
          )}
          data-testid="plan-preview-build-button"
        >
          <Typography.Text className="font-medium text-[14px] text-ink-inverse leading-5">
            {t(I18nKey.COMMON$BUILD)}{" "}
            <Typography.Text className="font-medium text-ink-inverse">
              ⌘↩
            </Typography.Text>
          </Typography.Text>
        </Button>
      </div>
    </div>
  );
}
