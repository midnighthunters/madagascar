import { useTranslation } from "react-i18next";

export function GuideMessage() {
  const { t } = useTranslation();

  return (
    <div className="w-fit flex flex-col sm:flex-row items-center justify-center gap-1.5 text-[#6F7680] text-xs font-medium">
      <span className="">{t("HOME$GUIDE_MESSAGE_TITLE")} </span>
      <a
        href="https://docs.all-hands.dev/usage/getting-started"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="font-semibold text-[#725E19] underline decoration-[#D7BC58] decoration-2 underline-offset-3 hover:text-[#4D4015]">
          {t("COMMON$CLICK_HERE")}
        </span>
      </a>
    </div>
  );
}
