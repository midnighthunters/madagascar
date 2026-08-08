import { useTranslation } from "react-i18next";
import { Dispatch, SetStateAction } from "react";
import { useClientAnalytics } from "#/hooks/use-client-analytics";
import { Card } from "#/ui/card";
import { CardTitle } from "#/ui/card-title";
import { Typography } from "#/ui/typography";
import { cn } from "#/utils/utils";
import { I18nKey } from "#/i18n/declaration";
import { setCTADismissed } from "#/utils/local-storage";
import CloseIcon from "#/icons/close.svg?react";

interface HomepageCTAProps {
  setShouldShowCTA: Dispatch<SetStateAction<boolean>>;
}

export function HomepageCTA({ setShouldShowCTA }: HomepageCTAProps) {
  const { t } = useTranslation();
  const { trackEnterpriseCTAClicked } = useClientAnalytics();

  const handleLearnMoreClick = () => {
    trackEnterpriseCTAClicked({ location: "home_page" });
  };

  const handleClose = () => {
    setCTADismissed("homepage");
    setShouldShowCTA(false);
  };

  return (
    <Card className={cn("w-[320px]")}>
      <button
        type="button"
        onClick={handleClose}
        className={cn(
          "absolute top-3 right-3 size-7 rounded-lg",
          "border border-[#E7E9ED] bg-[#F7F8FA]",
          "flex items-center justify-center",
          "text-[#6F7680] hover:text-[#272B30] cursor-pointer",
        )}
        aria-label="Close"
      >
        <CloseIcon width={16} height={16} />
      </button>

      <div className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <CardTitle className="font-semibold text-xl leading-7 tracking-normal text-[#272B30]">
            {t(I18nKey.CTA$ENTERPRISE_TITLE)}
          </CardTitle>

          <Typography.Text className="font-normal text-sm leading-5 tracking-normal text-[#6F7680]">
            {t(I18nKey.CTA$ENTERPRISE_DESCRIPTION)}
          </Typography.Text>
        </div>

        <a
          data-testid="homepage-cta-learn-more"
          href="https://madagascar.dev/enterprise/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLearnMoreClick}
          className={cn(
            "inline-flex items-center justify-center",
            "w-fit h-10 px-4 rounded-xl",
            "bg-[#D7BC58] border border-[#C7AA42] shadow-[0_3px_0_#B99D39]",
            "text-[#342B0E] hover:-translate-y-0.5",
            "font-semibold text-sm",
          )}
        >
          {t(I18nKey.CTA$LEARN_MORE)}
        </a>
      </div>
    </Card>
  );
}
