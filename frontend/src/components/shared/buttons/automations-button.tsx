import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { StyledTooltip } from "#/components/shared/buttons/styled-tooltip";
import AutomationsIcon from "#/icons/automations.svg?react";
import { cn } from "#/utils/utils";

interface AutomationsButtonProps {
  disabled?: boolean;
}

export function AutomationsButton({
  disabled = false,
}: AutomationsButtonProps) {
  const { t } = useTranslation();

  const label = t(I18nKey.SIDEBAR$AUTOMATIONS);

  return (
    <StyledTooltip content={label} placement="right">
      <a
        href="/automations"
        data-testid="automations-button"
        aria-label={label}
        tabIndex={disabled ? -1 : 0}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
          }
        }}
        className={cn(
          "h-9 w-9 md:w-full px-0 md:px-3 rounded-xl inline-flex items-center justify-center md:justify-start gap-2.5 border border-transparent text-[#555C65] hover:bg-[#F3F4F6] hover:text-[#272B30] text-sm font-medium",
          {
            "pointer-events-none opacity-50": disabled,
          },
        )}
      >
        <AutomationsIcon width={18} height={18} />
        <span className="hidden md:inline">{label}</span>
      </a>
    </StyledTooltip>
  );
}
