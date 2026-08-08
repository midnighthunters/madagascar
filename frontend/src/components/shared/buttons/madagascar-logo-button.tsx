import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { StyledTooltip } from "#/components/shared/buttons/styled-tooltip";
import { AnimalAvatar } from "#/components/shared/animal-avatar";

export function MadagascarLogoButton() {
  const { t } = useTranslation();

  const tooltipText = t(I18nKey.BRANDING$MADAGASCAR);
  const ariaLabel = t(I18nKey.BRANDING$MADAGASCAR_LOGO);

  return (
    <StyledTooltip content={tooltipText}>
      <NavLink
        to="/"
        aria-label={ariaLabel}
        className="group flex items-center gap-2.5 rounded-xl px-1.5 py-1.5 transition-colors duration-150 hover:bg-surface-muted md:w-full md:px-2"
      >
        <AnimalAvatar animal="owl" size="sm" status="lead" showBadge={false} />
        <div className="hidden md:flex flex-col">
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <span className="font-extrabold text-[13px] tracking-[0.12em] text-ink transition-colors uppercase leading-none">
            MADAGASCAR
          </span>
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <span className="text-[10px] font-medium tracking-tight text-ink-muted leading-none mt-1">
            Desktop agent IDE
          </span>
        </div>
      </NavLink>
    </StyledTooltip>
  );
}
