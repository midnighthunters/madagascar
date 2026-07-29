import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import ListIcon from "#/icons/list.svg?react";
import { StyledTooltip } from "#/components/shared/buttons/styled-tooltip";
import { cn } from "#/utils/utils";

interface ConversationPanelButtonProps {
  isOpen: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function ConversationPanelButton({
  isOpen,
  onClick,
  disabled = false,
}: ConversationPanelButtonProps) {
  const { t } = useTranslation();

  const label = t(I18nKey.SIDEBAR$CONVERSATIONS);

  return (
    <StyledTooltip content={label}>
      <button
        type="button"
        data-testid="toggle-conversation-panel"
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "w-9 h-9 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 transition-all duration-300 shadow-md",
          isOpen
            ? "bg-white/20 text-white border-white/40 shadow-lg scale-105"
            : "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white",
          disabled && "opacity-50 pointer-events-none",
        )}
      >
        <ListIcon width={18} height={18} />
      </button>
    </StyledTooltip>
  );
}
