import { useTranslation } from "react-i18next";
import PRIcon from "#/icons/u-pr.svg?react";
import { cn, getCreatePRPrompt } from "#/utils/utils";
import { useUserProviders } from "#/hooks/use-user-providers";
import { useTrackCreatePrButtonClicked } from "#/hooks/mutation/use-track-create-pr-button-clicked";
import { I18nKey } from "#/i18n/declaration";
import { Provider } from "#/types/settings";

interface GitControlBarPrButtonProps {
  onSuggestionsClick: (value: string) => void;
  hasRepository: boolean;
  currentGitProvider: Provider;
  isConversationReady?: boolean;
}

export function GitControlBarPrButton({
  onSuggestionsClick,
  hasRepository,
  currentGitProvider,
  isConversationReady = true,
}: GitControlBarPrButtonProps) {
  const { t } = useTranslation();
  const { providers } = useUserProviders();
  const { mutate: trackCreatePrButtonClicked } =
    useTrackCreatePrButtonClicked();

  const providersAreSet = providers.length > 0;
  const isButtonEnabled =
    providersAreSet && hasRepository && isConversationReady;

  const handlePrClick = () => {
    trackCreatePrButtonClicked(currentGitProvider);
    onSuggestionsClick(getCreatePRPrompt(currentGitProvider));
  };

  return (
    <button
      type="button"
      onClick={handlePrClick}
      disabled={!isButtonEnabled}
      className={cn(
        "md-button flex flex-row gap-1 items-center justify-center px-2 py-1 rounded-xl border w-[126px] min-w-[126px] h-7 shadow-[var(--md-shadow-control)]",
        isButtonEnabled
          ? "bg-surface-raised border-line-strong hover:bg-surface-muted cursor-pointer"
          : "bg-surface-muted border-line cursor-not-allowed",
      )}
    >
      <div className="w-3 h-3 flex items-center justify-center">
        <PRIcon width={12} height={12} color="currentColor" />
      </div>
      <div
        className="font-medium text-ink-secondary text-xs leading-5 max-w-[126px] truncate"
        title={t(I18nKey.COMMON$PULL_REQUEST)}
      >
        {t(I18nKey.COMMON$PULL_REQUEST)}
      </div>
    </button>
  );
}
