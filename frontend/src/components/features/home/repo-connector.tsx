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
      className="md-surface-card relative flex min-h-[300px] w-full flex-1 flex-col rounded-[18px] border border-line bg-surface p-5 sm:p-6"
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
