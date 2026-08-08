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
        "flex flex-row gap-1 items-center justify-center px-2 py-1 rounded-xl border w-[76px] min-w-[76px] shadow-[0_2px_0_#DFE2E7]",
        isButtonEnabled
          ? "bg-white border-[#D8DCE2] hover:bg-[#F3F4F6] cursor-pointer"
          : "bg-[#F0F2F5] border-[#E7E9ED] cursor-not-allowed",
      )}
    >
      <div className="w-3 h-3 flex items-center justify-center">
        <ArrowDownIcon width={12} height={12} color="#6F7680" />
      </div>
      <div
        className="font-medium text-[#555C65] text-xs leading-5 max-w-[76px] truncate"
        title={t(I18nKey.COMMON$PULL)}
      >
        {t(I18nKey.COMMON$PULL)}
      </div>
    </button>
  );
}
