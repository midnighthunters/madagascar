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
        className="group flex items-center gap-2.5 md:w-full px-1.5 md:px-2 py-1.5 rounded-xl hover:bg-[#F3F4F6] transition-colors duration-150"
      >
        <AnimalAvatar animal="owl" size="sm" status="lead" showBadge={false} />
        <div className="hidden md:flex flex-col">
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <span className="font-extrabold text-[13px] tracking-[0.12em] text-[#403815] group-hover:text-[#7B651C] transition-colors uppercase leading-none">
            MADAGASCAR
          </span>
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <span className="text-[10px] font-medium tracking-tight text-[#7A8088] leading-none mt-1">
            Desktop agent IDE
          </span>
        </div>
      </NavLink>
    </StyledTooltip>
  );
}
