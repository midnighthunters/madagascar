import { AnimalAvatar } from "#/components/shared/animal-avatar";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 backdrop-blur-xl bg-neutral-900/80 border border-white/20 px-3 py-1.5 rounded-full shadow-lg">
      <AnimalAvatar animal="owl" size="xs" status="executing" showBadge={false} />
      {/* eslint-disable-next-line i18next/no-literal-string */}
      <span className="text-xs font-medium text-amber-300">Wise Owl Working</span>
      <div className="flex items-center space-x-1">
        <span
          className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite]"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite]"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite]"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
