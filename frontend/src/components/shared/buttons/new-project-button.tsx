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
          "w-9 h-9 rounded-2xl flex items-center justify-center backdrop-blur-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 shadow-lg hover:bg-amber-400/30 hover:scale-105 transition-all duration-300",
          {
            "pointer-events-none opacity-50": disabled,
          },
        )}
      >
        <PlusIcon width={18} height={18} />
      </NavLink>
    </StyledTooltip>
  );
}
