import { GuideMessage } from "./guide-message";
import { HomeHeaderTitle } from "./home-header-title";
import { AgentIdentity } from "#/components/shared/animal-avatar";

export function HomeHeader() {
  return (
    <header className="flex flex-col items-center text-center">
      <div className="mb-5 rounded-[18px] border border-line bg-surface px-5 py-4 shadow-[var(--md-shadow-card)]">
        <AgentIdentity
          animal="owl"
          size="xl"
          status="lead"
          label="Owl · Lead agent"
          detail="Ready to plan and build in your workspace"
        />
      </div>
      <HomeHeaderTitle />
      <div className="mt-5">
        <GuideMessage />
      </div>
    </header>
  );
}
