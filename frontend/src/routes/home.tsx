import React from "react";
import { PrefetchPageLinks } from "react-router";
import { HomeHeader } from "#/components/features/home/home-header/home-header";
import { RepoConnector } from "#/components/features/home/repo-connector";
import { TaskSuggestions } from "#/components/features/home/tasks/task-suggestions";
import { GitRepository } from "#/types/git";
import { NewConversation } from "#/components/features/home/new-conversation/new-conversation";
import { RecentConversations } from "#/components/features/home/recent-conversations/recent-conversations";
import { HomepageCTA } from "#/components/features/home/homepage-cta";
import { isCTADismissed } from "#/utils/local-storage";
import { useAppMode } from "#/hooks/use-app-mode";

<PrefetchPageLinks page="/conversations/:conversationId" />;

function HomeScreen() {
  const { isEnterpriseCloud } = useAppMode();
  const [selectedRepo, setSelectedRepo] = React.useState<GitRepository | null>(
    null,
  );

  const [shouldShowCTA, setShouldShowCTA] = React.useState(
    () => !isCTADismissed("homepage"),
  );

  return (
    <div
      data-testid="home-screen"
      className="h-full overflow-y-auto bg-canvas px-5 py-8 sm:px-7 lg:px-10 lg:py-10 custom-scrollbar-always"
    >
      <div className="mx-auto flex w-full max-w-[1080px] flex-col">
        <HomeHeader />

        <div className="pt-8 flex justify-center">
          <div
            className="flex w-full flex-col gap-5 md:flex-row md:items-stretch"
            data-testid="home-screen-new-conversation-section"
          >
            <NewConversation />
            <RepoConnector onRepoSelection={(repo) => setSelectedRepo(repo)} />
          </div>
        </div>

        <div className="pt-8 flex justify-center pb-10">
          <div
            className="flex w-full flex-col gap-5 md:flex-row"
            data-testid="home-screen-recent-conversations-section"
          >
            <RecentConversations />
            <TaskSuggestions filterFor={selectedRepo} />
          </div>
        </div>
      </div>

      {isEnterpriseCloud && shouldShowCTA && (
        <div className="fixed bottom-4 right-8 z-50 md:bottom-6 md:right-12">
          <HomepageCTA setShouldShowCTA={setShouldShowCTA} />
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
