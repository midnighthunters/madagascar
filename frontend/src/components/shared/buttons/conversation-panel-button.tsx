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
          "h-9 w-9 md:w-full px-0 md:px-3 rounded-xl flex items-center justify-center md:justify-start gap-2.5 border transition-all duration-150 text-sm font-medium",
          isOpen
            ? "bg-[#F0E8C4] text-[#4B3D12] border-[#D7BC58] shadow-[0_2px_0_#D7BC58]"
            : "bg-white text-[#555C65] border-transparent hover:bg-[#F3F4F6] hover:text-[#272B30]",
          disabled && "opacity-50 pointer-events-none",
        )}
      >
        <ListIcon width={18} height={18} />
        <span className="hidden md:inline">{label}</span>
      </button>
    </StyledTooltip>
  );
}
