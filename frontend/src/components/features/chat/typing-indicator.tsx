import { AnimalAvatar } from "#/components/shared/animal-avatar";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-assistant-bubble px-3 py-1.5 shadow-[var(--md-shadow-control)]">
      <AnimalAvatar
        animal="owl"
        size="xs"
        status="executing"
        showBadge={false}
      />
      {/* eslint-disable-next-line i18next/no-literal-string */}
      <span className="text-xs font-medium text-ink-secondary">
        Lead agent working
      </span>
      <span className="size-1.5 rounded-full bg-status-warning" aria-hidden="true" />
    </div>
  );
}
