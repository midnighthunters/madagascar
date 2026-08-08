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
        "flex flex-row gap-1 items-center justify-center px-2 py-1 rounded-xl border w-[77px] min-w-[77px] shadow-[0_2px_0_#DFE2E7]",
        isButtonEnabled
          ? "bg-white border-[#D8DCE2] hover:bg-[#F3F4F6] cursor-pointer"
          : "bg-[#F0F2F5] border-[#E7E9ED] cursor-not-allowed",
      )}
    >
      <div className="w-3 h-3 flex items-center justify-center">
        <ArrowUpIcon width={12} height={12} color="#6F7680" />
      </div>
      <div
        className="font-medium text-[#555C65] text-xs leading-5 max-w-[77px] truncate"
        title={t(I18nKey.COMMON$PUSH)}
      >
        {t(I18nKey.COMMON$PUSH)}
      </div>
    </button>
  );
}
