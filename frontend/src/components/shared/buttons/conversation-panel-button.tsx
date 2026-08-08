import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import ListIcon from "#/icons/list.svg?react";
import { StyledTooltip } from "#/components/shared/buttons/styled-tooltip";
import { cn } from "#/utils/utils";
import { Button } from "#/ui/button";

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
      <Button
        type="button"
        data-testid="toggle-conversation-panel"
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        variant={isOpen ? "secondary" : "ghost"}
        size="icon"
        className={cn(
          "md:w-full md:justify-start md:px-3",
          isOpen && "border-action bg-action-soft text-action",
          disabled && "opacity-50 pointer-events-none",
        )}
      >
        <ListIcon width={18} height={18} />
        <span className="hidden md:inline">{label}</span>
      </Button>
    </StyledTooltip>
  );
}
