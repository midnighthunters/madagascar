import { useTranslation } from "react-i18next";

export function GuideMessage() {
  const { t } = useTranslation();

  return (
    <div className="w-fit flex flex-col sm:flex-row items-center justify-center gap-1.5 text-ink-secondary text-xs font-medium">
      <span className="">{t("HOME$GUIDE_MESSAGE_TITLE")} </span>
      <a
        href="https://docs.all-hands.dev/usage/getting-started"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="font-semibold text-action underline decoration-action decoration-2 underline-offset-3 hover:text-action">
          {t("COMMON$CLICK_HERE")}
        </span>
      </a>
    </div>
  );
}
