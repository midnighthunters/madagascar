import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Suggestions } from "#/components/features/suggestions/suggestions";
import { I18nKey } from "#/i18n/declaration";
import { SUGGESTIONS } from "#/utils/suggestions";
import { useConversationStore } from "#/stores/conversation-store";
import { AnimalAvatar, AnimalBadge } from "#/components/shared/animal-avatar";

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
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute top-0 left-0 right-0 bottom-[151px] flex flex-col items-center justify-center pointer-events-auto px-4 z-10"
        >
          <div className="flex flex-col items-center p-6 rounded-3xl backdrop-blur-2xl bg-neutral-900/60 border border-white/15 shadow-2xl max-w-lg w-full text-center">
            <AnimalAvatar
              animal="owl"
              size="xl"
              status="lead"
              className="mb-3"
            />
            {/* eslint-disable-next-line i18next/no-literal-string */}
            <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-white pb-1">
              Madagascar Animal AI IDE
            </span>
            {/* eslint-disable-next-line i18next/no-literal-string */}
            <p className="text-xs text-white/70 mb-4 max-w-xs">
              {t(I18nKey.LANDING$TITLE)} — Powered by your team of specialized
              Animal Subagents.
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 mb-5">
              <AnimalBadge animal="dog" label="Coder Dog" />
              <AnimalBadge animal="monkey" label="Inspector Monkey" />
              <AnimalBadge animal="rabbit" label="Speedy Rabbit" />
              <AnimalBadge animal="penguin" label="Planner Penguin" />
            </div>

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
