import { ConnectToProviderMessage } from "./connect-to-provider-message";
import { RepositorySelectionForm } from "./repo-selection-form";
import { useUserProviders } from "#/hooks/use-user-providers";
import { GitRepository } from "#/types/git";

interface RepoConnectorProps {
  onRepoSelection: (repo: GitRepository | null) => void;
}

export function RepoConnector({ onRepoSelection }: RepoConnectorProps) {
  const { providers, isLoadingSettings } = useUserProviders();

  const providersAreSet = providers.length > 0;

  return (
    <section
      data-testid="repo-connector"
      className="w-full flex-1 flex flex-col rounded-[22px] p-5 sm:p-6 border-[1.5px] border-[#E7E9ED] bg-white min-h-[300px] relative shadow-[0_4px_0_#DFE2E7,0_8px_20px_rgba(20,30,50,0.04)]"
    >
      {!providersAreSet && <ConnectToProviderMessage />}
      {providersAreSet && (
        <RepositorySelectionForm
          onRepoSelection={onRepoSelection}
          isLoadingSettings={isLoadingSettings}
        />
      )}
    </section>
  );
}
