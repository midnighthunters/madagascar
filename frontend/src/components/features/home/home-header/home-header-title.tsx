import { useTranslation } from "react-i18next";
import { Typography } from "#/ui/typography";

export function HomeHeaderTitle() {
  const { t } = useTranslation();

  return (
    <div className="flex max-w-2xl flex-col items-center gap-2">
      <Typography.H1 className="text-[34px] sm:text-[40px]">
        {t("HOME$LETS_START_BUILDING")}
      </Typography.H1>
      <Typography.Paragraph className="max-w-xl text-[15px] leading-6 text-ink-secondary">
        {t("HOME$NEW_PROJECT_DESCRIPTION")}
      </Typography.Paragraph>
    </div>
  );
}
