import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ModalBackdrop } from "#/components/shared/modals/modal-backdrop";
import { ModalBody } from "#/components/shared/modals/modal-body";
import { BrandButton } from "#/components/features/settings/brand-button";
import { BaseModalTitle } from "#/components/shared/modals/confirmation-modals/base-modal";
import { I18nKey } from "#/i18n/declaration";
import { Provider } from "#/types/settings";
import { Branch, GitRepository } from "#/types/git";
import { GitRepoDropdown } from "#/components/features/home/git-repo-dropdown/git-repo-dropdown";
import { GitBranchDropdown } from "#/components/features/home/git-branch-dropdown/git-branch-dropdown";
import { GitProviderDropdown } from "#/components/features/home/git-provider-dropdown/git-provider-dropdown";
import { useUserProviders } from "#/hooks/use-user-providers";
import RepoForkedIcon from "#/icons/repo-forked.svg?react";
import { AnimalAvatar } from "#/components/shared/animal-avatar";

interface OpenRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (repository: GitRepository, branch: Branch) => void;
  defaultProvider?: Provider;
}

export function OpenRepositoryModal({
  isOpen,
  onClose,
  onLaunch,
  defaultProvider = "github",
}: OpenRepositoryModalProps) {
  const { t } = useTranslation();
  const { providers } = useUserProviders();

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [selectedRepository, setSelectedRepository] =
    useState<GitRepository | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  useEffect(() => {
    if (providers.length === 1 && !selectedProvider) {
      setSelectedProvider(providers[0]);
    } else if (providers.length > 1 && !selectedProvider && defaultProvider) {
      if (providers.includes(defaultProvider)) {
        setSelectedProvider(defaultProvider);
      }
    }
  }, [providers, selectedProvider, defaultProvider]);

  const handleProviderChange = useCallback(
    (provider: Provider | null) => {
      if (provider === selectedProvider) return;
      setSelectedProvider(provider);
      setSelectedRepository(null);
      setSelectedBranch(null);
    },
    [selectedProvider],
  );

  const handleRepositoryChange = useCallback((repository?: GitRepository) => {
    if (repository) {
      setSelectedRepository(repository);
      setSelectedBranch(null);
    } else {
      setSelectedRepository(null);
      setSelectedBranch(null);
    }
  }, []);

  const handleBranchSelect = useCallback((branch: Branch | null) => {
    setSelectedBranch(branch);
  }, []);

  const handleLaunch = () => {
    if (!selectedRepository || !selectedBranch) return;

    onLaunch(selectedRepository, selectedBranch);
    setSelectedRepository(null);
    setSelectedBranch(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedProvider(null);
    setSelectedRepository(null);
    setSelectedBranch(null);
    onClose();
  };

  if (!isOpen) return null;

  const activeProvider =
    selectedRepository?.git_provider || selectedProvider || defaultProvider;
  const canLaunch = !!selectedRepository && !!selectedBranch;

  return (
    <ModalBackdrop onClose={handleClose}>
      <ModalBody
        width="small"
        className="items-start backdrop-blur-2xl bg-neutral-900/90 border border-white/20 rounded-3xl p-6 shadow-2xl !gap-4"
      >
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-3">
            <AnimalAvatar animal="monkey" size="sm" showBadge={false} />
            <div className="flex items-center gap-2">
              <RepoForkedIcon
                width={20}
                height={20}
                className="text-amber-300"
              />
              <BaseModalTitle title={t(I18nKey.CONVERSATION$OPEN_REPOSITORY)} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-white/80 font-medium leading-[22px]">
              {t(I18nKey.CONVERSATION$SELECT_OR_INSERT_LINK)}
            </span>
            {providers.length > 1 && (
              <GitProviderDropdown
                providers={providers}
                value={selectedProvider}
                placeholder="Select Provider"
                onChange={handleProviderChange}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <GitRepoDropdown
            provider={activeProvider}
            value={selectedRepository?.id || null}
            repositoryName={selectedRepository?.full_name || null}
            onChange={handleRepositoryChange}
            placeholder="Search repositories..."
            className="w-full"
          />

          <GitBranchDropdown
            repository={selectedRepository?.full_name || null}
            provider={activeProvider}
            selectedBranch={selectedBranch}
            onBranchSelect={handleBranchSelect}
            defaultBranch={selectedRepository?.main_branch || null}
            placeholder="Select branch..."
            disabled={!selectedRepository}
            className="w-full"
          />
        </div>

        <div
          className="flex flex-col gap-2.5 w-full mt-2"
          onClick={(event) => event.stopPropagation()}
        >
          <BrandButton
            type="button"
            variant="primary"
            onClick={handleLaunch}
            className="w-full rounded-2xl py-2.5 bg-amber-400 text-black font-semibold hover:bg-amber-300"
            isDisabled={!canLaunch}
          >
            {t(I18nKey.BUTTON$LAUNCH)}
          </BrandButton>
          <BrandButton
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="w-full rounded-2xl py-2.5"
          >
            {t(I18nKey.BUTTON$CANCEL)}
          </BrandButton>
        </div>
      </ModalBody>
    </ModalBackdrop>
  );
}
