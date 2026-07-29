import { useTranslation } from "react-i18next";
import BranchIcon from "#/icons/u-code-branch.svg?react";
import { constructBranchUrl, cn } from "#/utils/utils";
import { Provider } from "#/types/settings";
import { I18nKey } from "#/i18n/declaration";
import { GitExternalLinkIcon } from "./git-external-link-icon";
import { useProviderHost } from "#/hooks/use-provider-host";

interface GitControlBarBranchButtonProps {
  selectedBranch: string | null | undefined;
  selectedRepository: string | null | undefined;
  gitProvider: Provider | null | undefined;
}

export function GitControlBarBranchButton({
  selectedBranch,
  selectedRepository,
  gitProvider,
}: GitControlBarBranchButtonProps) {
  const { t } = useTranslation();
  const providerHost = useProviderHost(gitProvider);

  const hasBranch = selectedBranch && selectedRepository && gitProvider;
  const branchUrl = hasBranch
    ? constructBranchUrl(
        gitProvider,
        selectedRepository,
        selectedBranch,
        providerHost,
      )
    : undefined;

  const buttonText = hasBranch ? selectedBranch : t(I18nKey.COMMON$NO_BRANCH);

  return (
    <a
      href={hasBranch ? branchUrl : undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex flex-row items-center justify-between gap-2 px-3 py-1.5 rounded-full w-fit flex-shrink-0 max-w-[200px] truncate relative transition-all duration-200 shadow-sm",
        hasBranch
          ? "backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30 cursor-pointer"
          : "backdrop-blur-xl bg-white/5 border border-white/10 cursor-not-allowed opacity-60 min-w-[108px]",
      )}
    >
      <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 text-white/80">
        <BranchIcon width={13} height={13} />
      </div>
      <div
        className="font-medium text-white text-xs leading-5 truncate"
        title={buttonText}
      >
        {buttonText}
      </div>
      {hasBranch && <GitExternalLinkIcon />}
    </a>
  );
}
