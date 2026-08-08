import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { V1SandboxStatus } from "#/api/sandbox-service/sandbox-service.types";
import { cn } from "#/utils/utils";
import { StyledTooltip } from "#/components/shared/buttons/styled-tooltip";

interface SandboxStatusIndicatorProps {
  sandboxStatus: V1SandboxStatus;
}

// Map V1SandboxStatus to translation keys
const getSandboxStatusLabel = (status: V1SandboxStatus): string => {
  switch (status) {
    case "RUNNING":
      return "COMMON$RUNNING";
    case "STARTING":
      return "COMMON$STARTING";
    case "PAUSED":
      return "COMMON$PAUSED";
    case "MISSING":
      return "COMMON$ARCHIVED";
    default:
      return "COMMON$STOPPED";
  }
};

export function SandboxStatusIndicator({
  sandboxStatus,
}: SandboxStatusIndicatorProps) {
  const { t } = useTranslation();

  const sandboxStatusBackgroundColor = useMemo(() => {
    switch (sandboxStatus) {
      case "RUNNING":
        return "bg-[#228B55]"; // Running/online - green
      case "STARTING":
        return "bg-[#C68A16]"; // Busy/starting - amber
      case "PAUSED":
        return "bg-[#8A919A]"; // Paused - grey
      case "MISSING":
        return "bg-[#8A919A]"; // Missing - grey (archived)
      default:
        return "bg-[#6F7680]"; // Default to grey for unknown states
    }
  }, [sandboxStatus]);

  const statusLabel = t(getSandboxStatusLabel(sandboxStatus));

  return (
    <StyledTooltip
      content={statusLabel}
      placement="right"
      showArrow
      tooltipClassName="bg-[#272B30] text-white text-xs shadow-lg"
    >
      <div
        className={cn("w-1.5 h-1.5 rounded-full", sandboxStatusBackgroundColor)}
      />
    </StyledTooltip>
  );
}
