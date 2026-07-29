import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { StyledTooltip } from "#/components/shared/buttons/styled-tooltip";
import { AnimalAvatar } from "#/components/shared/animal-avatar";

export function OpenHandsLogoButton() {
  const { t } = useTranslation();

  const tooltipText = t(I18nKey.BRANDING$OPENHANDS);
  const ariaLabel = t(I18nKey.BRANDING$OPENHANDS_LOGO);

  return (
    <StyledTooltip content={tooltipText}>
      <NavLink
        to="/"
        aria-label={ariaLabel}
        className="group flex items-center gap-2.5 px-3 py-1.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 shadow-md hover:bg-white/15 hover:border-amber-400/40 transition-all duration-300"
      >
        <AnimalAvatar animal="owl" size="xs" status="lead" showBadge={false} />
        <div className="flex flex-col">
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <span className="font-extrabold text-xs tracking-wider text-amber-300 group-hover:text-amber-200 transition-colors uppercase leading-none">
            MADAGASCAR
          </span>
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <span className="text-[9px] font-medium tracking-tight text-white/60 leading-none mt-0.5">
            Animal AI IDE
          </span>
        </div>
      </NavLink>
    </StyledTooltip>
  );
}
