import { useTranslation } from "react-i18next";
import { constructRepositoryUrl, cn } from "#/utils/utils";
import { Provider } from "#/types/settings";
import { I18nKey } from "#/i18n/declaration";
import { GitProviderIcon } from "#/components/shared/git-provider-icon";
import { GitExternalLinkIcon } from "./git-external-link-icon";
import RepoForkedIcon from "#/icons/repo-forked.svg?react";
import { useProviderHost } from "#/hooks/use-provider-host";

interface GitControlBarRepoButtonProps {
  selectedRepository: string | null | undefined;
  gitProvider: Provider | null | undefined;
  onClick?: () => void;
  disabled?: boolean;
}

export function GitControlBarRepoButton({
  selectedRepository,
  gitProvider,
  onClick,
  disabled,
}: GitControlBarRepoButtonProps) {
  const { t } = useTranslation();
  const providerHost = useProviderHost(gitProvider);

  const hasRepository = selectedRepository && gitProvider;

  const repositoryUrl = hasRepository
    ? constructRepositoryUrl(gitProvider, selectedRepository, providerHost)
    : undefined;

  const buttonText = hasRepository
    ? selectedRepository
    : t(I18nKey.COMMON$NO_REPO_CONNECTED);

  if (hasRepository) {
    return (
      <a
        href={repositoryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group flex flex-row items-center justify-between gap-2 px-3 py-1.5 rounded-xl flex-1 truncate relative",
          "bg-surface-raised border border-line-strong hover:bg-surface-muted cursor-pointer shadow-[var(--md-shadow-control)] transition-all duration-150",
        )}
      >
        <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
          <GitProviderIcon
            gitProvider={gitProvider as Provider}
            className="w-3.5 h-3.5 inline-flex"
          />
        </div>
        <div
          className="font-medium text-ink-secondary text-xs leading-5 truncate flex-1 min-w-0"
          title={buttonText}
        >
          {buttonText}
        </div>
        <GitExternalLinkIcon />
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex flex-row items-center justify-between gap-2 px-3 py-1.5 rounded-xl flex-1 truncate relative min-w-[170px]",
        "bg-surface-raised border border-line-strong shadow-[var(--md-shadow-control)] transition-all duration-150",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:bg-surface-muted hover:border-action",
      )}
    >
      <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 text-action">
        <RepoForkedIcon width={13} height={13} />
      </div>
      <div
        className="font-medium text-ink-secondary text-xs leading-5 truncate flex-1 min-w-0"
        title={buttonText}
      >
        {buttonText}
      </div>
    </button>
  );
}
