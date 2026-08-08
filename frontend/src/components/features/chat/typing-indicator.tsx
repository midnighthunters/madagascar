import { AnimalAvatar } from "#/components/shared/animal-avatar";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 bg-white border border-[#E7E9ED] px-3 py-1.5 rounded-xl shadow-[0_2px_0_#DFE2E7]">
      <AnimalAvatar
        animal="owl"
        size="xs"
        status="executing"
        showBadge={false}
      />
      {/* eslint-disable-next-line i18next/no-literal-string */}
      <span className="text-xs font-medium text-[#725E19]">
        Lead agent working
      </span>
      <div className="flex items-center space-x-1">
        <span
          className="w-1.5 h-1.5 bg-[#B58E18] rounded-full animate-[bounce_0.8s_infinite]"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-[#B58E18] rounded-full animate-[bounce_0.8s_infinite]"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-[#B58E18] rounded-full animate-[bounce_0.8s_infinite]"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
