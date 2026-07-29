import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import TachometerFastIcon from "#/icons/tachometer-fast.svg?react";
import PrStatusIcon from "#/icons/pr-status.svg?react";
import DocumentIcon from "#/icons/document.svg?react";
import WaterIcon from "#/icons/u-water.svg?react";

export type Suggestion = { label: I18nKey | string; value: string };

interface SuggestionItemProps {
  suggestion: Suggestion;
  onClick: (value: string) => void;
}

export function SuggestionItem({ suggestion, onClick }: SuggestionItemProps) {
  const { t } = useTranslation();

  const itemIcon = useMemo(() => {
    switch (suggestion.label) {
      case "INCREASE_TEST_COVERAGE":
        return <TachometerFastIcon width={20} height={20} color="#F59E0B" />;
      case "AUTO_MERGE_PRS":
        return <PrStatusIcon width={18} height={18} color="#3B82F6" />;
      case "FIX_README":
        return <DocumentIcon width={20} height={20} color="#10B981" />;
      case "CLEAN_DEPENDENCIES":
        return <WaterIcon width={20} height={20} color="#EC4899" />;
      default:
        return null;
    }
  }, [suggestion]);

  return (
    <button
      type="button"
      className="list-none backdrop-blur-xl bg-neutral-900/60 hover:bg-white/15 border border-white/15 rounded-2xl shadow-md flex-1 flex items-center justify-center cursor-pointer gap-2.5 h-[52px] px-4 transition-all duration-300 hover:scale-105 hover:border-amber-400/40"
      onClick={() => onClick(suggestion.value)}
    >
      {itemIcon}
      <span
        data-testid="suggestion"
        className="text-xs font-semibold leading-5 text-white/90 text-center cursor-pointer"
      >
        {t(suggestion.label)}
      </span>
    </button>
  );
}
