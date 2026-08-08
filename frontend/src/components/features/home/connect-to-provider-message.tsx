import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { BrandButton } from "#/components/features/settings/brand-button";
import { useSettings } from "#/hooks/query/use-settings";
import RepoForkedIcon from "#/icons/repo-forked.svg?react";
import { I18nKey } from "#/i18n/declaration";

export function ConnectToProviderMessage() {
  const { isLoading } = useSettings();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 justify-between h-full">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-[10px]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E7E9ED] bg-[#F7F8FA] text-[#725E19]">
            <RepoForkedIcon width={18} height={18} />
          </span>
          <span className="leading-5 font-bold text-base text-[#272B30]">
            {t(I18nKey.COMMON$OPEN_REPOSITORY)}
          </span>
        </div>
        <p className="text-sm leading-6 text-[#6F7680]">
          {t("HOME$CONNECT_PROVIDER_MESSAGE")}
        </p>
      </div>
      <Link
        data-testid="navigate-to-settings-button"
        to="/settings/integrations"
        className="self-start w-full"
      >
        <BrandButton
          type="button"
          variant="primary"
          isDisabled={isLoading}
          className="w-full font-semibold"
        >
          {!isLoading && t("SETTINGS$TITLE")}
          {isLoading && t("HOME$LOADING")}
        </BrandButton>
      </Link>
    </div>
  );
}
