import { useTranslation } from "react-i18next";
import ArrowUpIcon from "#/icons/u-arrow-up.svg?react";
import { cn, getGitPushPrompt } from "#/utils/utils";
import { useUserProviders } from "#/hooks/use-user-providers";
import { I18nKey } from "#/i18n/declaration";
import { Provider } from "#/types/settings";

interface GitControlBarPushButtonProps {
  onSuggestionsClick: (value: string) => void;
  hasRepository: boolean;
  currentGitProvider: Provider;
  isConversationReady?: boolean;
}

export function GitControlBarPushButton({
  onSuggestionsClick,
  hasRepository,
  currentGitProvider,
  isConversationReady = true,
}: GitControlBarPushButtonProps) {
  const { t } = useTranslation();
  const { providers } = useUserProviders();

  const providersAreSet = providers.length > 0;
  const isButtonEnabled =
    providersAreSet && hasRepository && isConversationReady;

  const handlePushClick = () => {
    onSuggestionsClick(getGitPushPrompt(currentGitProvider));
  };

  return (
    <button
      type="button"
      onClick={handlePushClick}
      disabled={!isButtonEnabled}
      className={cn(
        "md-button flex flex-row gap-1 items-center justify-center px-2 py-1 rounded-xl border w-[77px] min-w-[77px] shadow-[var(--md-shadow-control)]",
        isButtonEnabled
          ? "bg-surface-raised border-line-strong hover:bg-surface-muted cursor-pointer"
          : "bg-surface-muted border-line cursor-not-allowed",
      )}
    >
      <div className="w-3 h-3 flex items-center justify-center">
        <ArrowUpIcon width={12} height={12} color="currentColor" />
      </div>
      <div
        className="font-medium text-ink-secondary text-xs leading-5 max-w-[77px] truncate"
        title={t(I18nKey.COMMON$PUSH)}
      >
        {t(I18nKey.COMMON$PUSH)}
      </div>
    </button>
  );
}
