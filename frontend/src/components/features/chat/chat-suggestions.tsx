import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Suggestions } from "#/components/features/suggestions/suggestions";
import { I18nKey } from "#/i18n/declaration";
import { SUGGESTIONS } from "#/utils/suggestions";
import { useConversationStore } from "#/stores/conversation-store";
import { AnimalAvatar } from "#/components/shared/animal-avatar";

interface ChatSuggestionsProps {
  onSuggestionsClick: (value: string) => void;
}

export function ChatSuggestions({ onSuggestionsClick }: ChatSuggestionsProps) {
  const { t } = useTranslation();
  const { shouldHideSuggestions } = useConversationStore();

  return (
    <AnimatePresence>
      {!shouldHideSuggestions && (
        <motion.div
          data-testid="chat-suggestions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute top-0 left-0 right-0 bottom-[151px] flex flex-col items-center justify-center pointer-events-auto px-4 z-10"
        >
          <div className="md-surface-card flex w-full max-w-lg flex-col items-center rounded-[20px] border border-line bg-surface p-6 text-center">
            <AnimalAvatar
              animal="owl"
              size="xl"
              status="lead"
              className="mb-3"
            />
            {/* eslint-disable-next-line i18next/no-literal-string */}
            <span className="text-2xl font-bold tracking-[-0.025em] text-ink pb-1">
              Madagascar
            </span>
            {/* eslint-disable-next-line i18next/no-literal-string */}
            <p className="text-sm leading-5 text-ink-secondary mb-5 max-w-sm">
              {t(I18nKey.SUGGESTIONS$WHAT_TO_BUILD)}
            </p>

            <Suggestions
              suggestions={Object.entries(SUGGESTIONS.repo)
                .slice(0, 4)
                .map(([label, value]) => ({
                  label,
                  value,
                }))}
              onSuggestionClick={onSuggestionsClick}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
