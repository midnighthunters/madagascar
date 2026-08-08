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
        "group flex flex-row items-center justify-between gap-2 px-3 py-1.5 rounded-xl w-fit flex-shrink-0 max-w-[200px] truncate relative transition-all duration-150 shadow-[0_2px_0_#DFE2E7]",
        hasBranch
          ? "bg-white border border-[#D8DCE2] hover:bg-[#F3F4F6] hover:border-[#C7AA42] cursor-pointer"
          : "bg-[#F0F2F5] border border-[#E7E9ED] cursor-not-allowed opacity-60 min-w-[108px]",
      )}
    >
      <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 text-[#6F7680]">
        <BranchIcon width={13} height={13} />
      </div>
      <div
        className="font-medium text-[#363B42] text-xs leading-5 truncate"
        title={buttonText}
      >
        {buttonText}
      </div>
      {hasBranch && <GitExternalLinkIcon />}
    </a>
  );
}
