import { GuideMessage } from "./guide-message";
import { HomeHeaderTitle } from "./home-header-title";
import { AnimalAvatar } from "#/components/shared/animal-avatar";

export function HomeHeader() {
  return (
    <header className="flex flex-col items-center text-center">
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-[#E7E9ED] bg-white px-3 py-2 shadow-[0_2px_0_#DFE2E7]">
        <AnimalAvatar animal="owl" size="sm" status="lead" />
        <span className="text-xs font-semibold tracking-[0.08em] text-[#6F7680] uppercase">
          {/* eslint-disable-next-line i18next/no-literal-string */}
          Lead agent ready
        </span>
      </div>
      <HomeHeaderTitle />
      <div className="mt-5">
        <GuideMessage />
      </div>
    </header>
  );
}
