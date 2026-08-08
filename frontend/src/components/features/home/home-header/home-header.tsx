import { GuideMessage } from "./guide-message";
import { HomeHeaderTitle } from "./home-header-title";
import { AnimalAvatar } from "#/components/shared/animal-avatar";

export function HomeHeader() {
  return (
    <header className="flex flex-col items-center text-center">
      <div
        className="mb-4 rounded-2xl border border-[#E7E9ED] bg-white p-2 shadow-[0_2px_0_#DFE2E7]"
        aria-hidden="true"
      >
        <AnimalAvatar animal="owl" size="sm" status="lead" />
      </div>
      <HomeHeaderTitle />
      <div className="mt-5">
        <GuideMessage />
      </div>
    </header>
  );
}
