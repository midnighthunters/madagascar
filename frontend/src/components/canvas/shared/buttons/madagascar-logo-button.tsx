import { useTranslation } from "react-i18next";
import MadagascarLogo from "#/assets/branding/madagascar-logo.svg?react";
import { NavigationLink } from "#/components/shared/navigation-link";
import { I18nKey } from "#/i18n/declaration";
import { cn } from "#/utils/utils";

const DEFAULT_LOGO_WIDTH = 46;
const DEFAULT_LOGO_HEIGHT = 30;

export type MadagascarLogoButtonProps = {
  className?: string;
  /** Applied to the root `<svg>` (e.g. `max-w-none` so Tailwind preflight doesn’t clamp wide marks inside a narrow flex slot). */
  logoClassName?: string;
  logoWidth?: number;
  logoHeight?: number;
};

export function MadagascarLogoButton({
  className,
  logoClassName,
  logoWidth = DEFAULT_LOGO_WIDTH,
  logoHeight = DEFAULT_LOGO_HEIGHT,
}: MadagascarLogoButtonProps = {}) {
  const { t } = useTranslation("madagascar");

  const ariaLabel = t(I18nKey.BRANDING$MADAGASCAR_LOGO);

  return (
    <NavigationLink
      to="/conversations"
      aria-label={ariaLabel}
      className={cn(className)}
    >
      <MadagascarLogo
        width={logoWidth}
        height={logoHeight}
        className={cn("shrink-0", logoClassName)}
      />
    </NavigationLink>
  );
}
