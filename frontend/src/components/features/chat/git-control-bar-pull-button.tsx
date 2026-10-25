import { useTranslation } from "react-i18next";
import ArrowDownIcon from "#/icons/u-arrow-down.svg?react";
import { cn, getGitPullPrompt } from "#/utils/utils";
import { useActiveConversation } from "#/hooks/query/use-active-conversation";
import { useUserProviders } from "#/hooks/use-user-providers";
import { I18nKey } from "#/i18n/declaration";

interface GitControlBarPullButtonProps {
  onSuggestionsClick: (value: string) => void;
  isConversationReady?: boolean;
}

export function GitControlBarPullButton({
  onSuggestionsClick,
  isConversationReady = true,
}: GitControlBarPullButtonProps) {
  const { t } = useTranslation();
  const { data: conversation } = useActiveConversation();
  const { providers } = useUserProviders();

  const providersAreSet = providers.length > 0;
  const hasRepository = conversation?.selected_repository;
  const isButtonEnabled =
    providersAreSet && hasRepository && isConversationReady;

  const handlePullClick = () => {
    onSuggestionsClick(getGitPullPrompt());
  };

  return (
    <button
      type="button"
      onClick={handlePullClick}
      disabled={!isButtonEnabled}
      className={cn(
        "md-button flex flex-row gap-1 items-center justify-center px-2 py-1 rounded-xl border w-[76px] min-w-[76px] shadow-[var(--md-shadow-control)]",
        isButtonEnabled
          ? "bg-surface-raised border-line-strong hover:bg-surface-muted cursor-pointer"
          : "bg-surface-muted border-line cursor-not-allowed",
      )}
    >
      <div className="w-3 h-3 flex items-center justify-center">
        <ArrowDownIcon width={12} height={12} color="currentColor" />
      </div>
      <div
        className="font-medium text-ink-secondary text-xs leading-5 max-w-[76px] truncate"
        title={t(I18nKey.COMMON$PULL)}
      >
        {t(I18nKey.COMMON$PULL)}
      </div>
    </button>
  );
}
