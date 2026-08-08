import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { StyledTooltip } from "#/components/shared/buttons/styled-tooltip";
import PlusIcon from "#/icons/u-plus.svg?react";
import { cn } from "#/utils/utils";

interface NewProjectButtonProps {
  disabled?: boolean;
}

export function NewProjectButton({ disabled = false }: NewProjectButtonProps) {
  const { t } = useTranslation();

  const startNewProject = t(I18nKey.CONVERSATION$START_NEW);

  return (
    <StyledTooltip content={startNewProject} placement="right">
      <NavLink
        to="/"
        data-testid="new-project-button"
        aria-label={startNewProject}
        tabIndex={disabled ? -1 : 0}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
          }
        }}
        className={cn(
          "h-9 w-9 md:w-full px-0 md:px-3 rounded-xl flex items-center justify-center md:justify-start gap-2.5 bg-[#D7BC58] border border-[#C7AA42] text-[#342B0E] shadow-[0_3px_0_#B99D39] hover:-translate-y-0.5 hover:bg-[#DFC765] active:translate-y-0.5 active:shadow-[0_1px_0_#B99D39] transition-all duration-150 font-semibold text-sm",
          {
            "pointer-events-none opacity-50": disabled,
          },
        )}
      >
        <PlusIcon width={18} height={18} />
        <span className="hidden md:inline">{startNewProject}</span>
      </NavLink>
    </StyledTooltip>
  );
}
