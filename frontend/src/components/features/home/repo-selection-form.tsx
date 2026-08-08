import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useCreateConversation } from "#/hooks/mutation/use-create-conversation";
import { useIsCreatingConversation } from "#/hooks/use-is-creating-conversation";
import { Branch, GitRepository } from "#/types/git";
import { BrandButton } from "../settings/brand-button";
import { useUserProviders } from "#/hooks/use-user-providers";
import { Provider } from "#/types/settings";
import { I18nKey } from "#/i18n/declaration";
import RepoForkedIcon from "#/icons/repo-forked.svg?react";
import { GitProviderDropdown } from "./git-provider-dropdown";
import { GitBranchDropdown } from "./git-branch-dropdown";
import { GitRepoDropdown } from "./git-repo-dropdown";
import { useHomeStore } from "#/stores/home-store";
import { AnimalAvatar } from "#/components/shared/animal-avatar";

interface RepositorySelectionFormProps {
  onRepoSelection: (repo: GitRepository | null) => void;
  isLoadingSettings?: boolean;
}

export function RepositorySelectionForm({
  onRepoSelection,
  isLoadingSettings = false,
}: RepositorySelectionFormProps) {
  const navigate = useNavigate();

  const [selectedRepository, setSelectedRepository] =
    React.useState<GitRepository | null>(null);
  const [selectedBranch, setSelectedBranch] = React.useState<Branch | null>(
    null,
  );
  const [selectedProvider, setSelectedProvider] =
    React.useState<Provider | null>(null);

  const { providers } = useUserProviders();
  const {
    addRecentRepository,
    setLastSelectedProvider,
    getLastSelectedProvider,
  } = useHomeStore();
  const {
    mutate: createConversation,
    isPending,
    isSuccess,
  } = useCreateConversation();

  const isCreatingConversationElsewhere = useIsCreatingConversation();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (providers.length === 0) return;

    if (providers.length === 1 && !selectedProvider) {
      setSelectedProvider(providers[0]);
      return;
    }

    if (providers.length > 1 && !selectedProvider) {
      const lastSelected = getLastSelectedProvider();
      if (lastSelected && providers.includes(lastSelected)) {
        setSelectedProvider(lastSelected);
      }
    }
  }, [providers, selectedProvider, getLastSelectedProvider]);

  const isCreatingConversation =
    isPending || isSuccess || isCreatingConversationElsewhere;

  const handleProviderSelection = (provider: Provider | null) => {
    if (provider === selectedProvider) {
      return;
    }

    setSelectedProvider(provider);
    setLastSelectedProvider(provider);
    setSelectedRepository(null);
    setSelectedBranch(null);
    onRepoSelection(null);
  };

  const handleBranchSelection = React.useCallback((branch: Branch | null) => {
    setSelectedBranch(branch);
  }, []);

  const renderProviderSelector = () => {
    if (providers.length <= 1) {
      return null;
    }

    return (
      <GitProviderDropdown
        providers={providers}
        value={selectedProvider}
        placeholder="Select Provider"
        className="max-w-[500px]"
        onChange={handleProviderSelection}
        disabled={isLoadingSettings}
      />
    );
  };

  const renderRepositorySelector = () => {
    const handleRepoSelection = (repository?: GitRepository) => {
      if (repository) {
        onRepoSelection(repository);
        setSelectedRepository(repository);
      } else {
        onRepoSelection(null);
        setSelectedRepository(null);
        setSelectedBranch(null);
      }
    };

    return (
      <GitRepoDropdown
        provider={selectedProvider || providers[0]}
        value={selectedRepository?.id || null}
        repositoryName={selectedRepository?.full_name || null}
        placeholder="user/repo"
        disabled={!selectedProvider || isLoadingSettings}
        onChange={handleRepoSelection}
        className="max-w-auto"
      />
    );
  };

  const renderBranchSelector = () => {
    const defaultBranch = selectedRepository?.main_branch || null;
    return (
      <GitBranchDropdown
        repository={selectedRepository?.full_name || null}
        provider={selectedProvider || providers[0]}
        selectedBranch={selectedBranch}
        onBranchSelect={handleBranchSelection}
        defaultBranch={defaultBranch}
        placeholder="Select branch..."
        className="max-w-full"
        disabled={!selectedRepository || isLoadingSettings}
      />
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 pb-4">
          <AnimalAvatar animal="monkey" size="sm" showBadge={false} />
          <div className="flex items-center gap-2">
            <RepoForkedIcon width={20} height={20} className="text-action" />
            <span className="leading-5 font-bold text-base text-ink">
              {t(I18nKey.COMMON$OPEN_REPOSITORY)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-secondary font-medium">
            {t(I18nKey.HOME$SELECT_OR_INSERT_URL)}
          </span>
          {renderProviderSelector()}
        </div>
        {renderRepositorySelector()}
        {renderBranchSelector()}
      </div>

      <BrandButton
        testId="repo-launch-button"
        variant="primary"
        type="button"
        isDisabled={
          !selectedRepository ||
          !selectedBranch ||
          isCreatingConversation ||
          (providers.length > 1 && !selectedProvider) ||
          isLoadingSettings
        }
        onClick={() => {
          if (selectedRepository) {
            addRecentRepository(selectedRepository);
          }

          createConversation(
            {
              repository: {
                name: selectedRepository?.full_name || "",
                gitProvider: selectedRepository?.git_provider || "github",
                branch: selectedBranch?.name || "main",
              },
            },
            {
              onSuccess: (data) =>
                navigate(`/conversations/${data.conversation_id}`),
            },
          );
        }}
        className="mt-auto w-full font-semibold"
      >
        {!isCreatingConversation && "Launch Workspace"}
        {isCreatingConversation && t("HOME$LOADING")}
      </BrandButton>
    </div>
  );
}
