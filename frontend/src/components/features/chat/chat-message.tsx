import React from "react";
import { cn } from "#/utils/utils";
import { CopyToClipboardButton } from "#/components/shared/buttons/copy-to-clipboard-button";
import { MadagascarSourceType } from "#/types/core/base";
import { StyledTooltip } from "#/components/shared/buttons/styled-tooltip";
import { MarkdownRenderer } from "../markdown/markdown-renderer";
import { AnimalAvatar } from "#/components/shared/animal-avatar";

interface ChatMessageProps {
  type: MadagascarSourceType;
  message: string;
  actions?: Array<{
    icon: React.ReactNode;
    onClick: () => void;
    tooltip?: string;
  }>;
  isFromPlanningAgent?: boolean;
}

export function ChatMessage({
  type,
  message,
  children,
  actions,
  isFromPlanningAgent = false,
}: React.PropsWithChildren<ChatMessageProps>) {
  const [isHovering, setIsHovering] = React.useState(false);
  const [isCopy, setIsCopy] = React.useState(false);

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(message);
    setIsCopy(true);
  };

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isCopy) {
      timeout = setTimeout(() => {
        setIsCopy(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isCopy]);

  return (
    <article
      data-testid={`${type}-message`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "relative w-fit max-w-full last:mb-4 transition-all duration-150",
        "flex flex-col gap-2",
        type === "user" &&
          "p-4 rounded-[20px] rounded-br-md bg-[#EEF4FA] border border-[#CCDEEF] text-[#263746] self-end shadow-[0_3px_0_#D7E3EF]",
        type === "agent" &&
          "mt-4 p-4 rounded-[20px] rounded-bl-md bg-white border border-[#E7E9ED] w-full max-w-full text-[#272B30] shadow-[0_3px_0_#DFE2E7]",
        isFromPlanningAgent &&
          type === "agent" &&
          "border-[#D7BC58] bg-[#FFFCF0] p-4 mt-2 shadow-[0_3px_0_#E4D48E]",
      )}
    >
      {/* Header Avatar Badge */}
      <div className="flex items-center gap-2 mb-1 border-b border-[#E7E9ED] pb-2">
        {type === "agent" ? (
          <>
            <AnimalAvatar
              animal={isFromPlanningAgent ? "penguin" : "owl"}
              size="xs"
              status={isFromPlanningAgent ? "thinking" : "lead"}
            />
            {/* eslint-disable-next-line i18next/no-literal-string */}
            <span className="text-xs font-semibold text-[#725E19]">
              {isFromPlanningAgent ? "Planner agent" : "Lead agent"}
            </span>
          </>
        ) : (
          <>
            <AnimalAvatar animal="dog" size="xs" showBadge={false} />
            {/* eslint-disable-next-line i18next/no-literal-string */}
            <span className="text-xs font-semibold text-[#3478C5]">User</span>
          </>
        )}
      </div>

      <div
        className={cn(
          "absolute -top-2.5 -right-2.5 z-20",
          !isHovering ? "hidden" : "flex",
          "items-center gap-1",
        )}
      >
        {actions?.map((action, index) =>
          action.tooltip ? (
            <StyledTooltip key={index} content={action.tooltip} placement="top">
              <button
                type="button"
                onClick={action.onClick}
                className="p-1.5 rounded-lg bg-white border border-[#D8DCE2] hover:bg-[#F3F4F6] text-[#555C65] cursor-pointer shadow-sm"
                aria-label={action.tooltip}
              >
                {action.icon}
              </button>
            </StyledTooltip>
          ) : (
            <button
              key={index}
              type="button"
              onClick={action.onClick}
              className="p-1.5 rounded-lg bg-white border border-[#D8DCE2] hover:bg-[#F3F4F6] text-[#555C65] cursor-pointer shadow-sm"
              aria-label={`Action ${index + 1}`}
            >
              {action.icon}
            </button>
          ),
        )}

        <CopyToClipboardButton
          isHidden={!isHovering}
          isDisabled={isCopy}
          onClick={handleCopyToClipboard}
          mode={isCopy ? "copied" : "copy"}
        />
      </div>

      <div
        className="text-sm leading-relaxed"
        style={{
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
      >
        <MarkdownRenderer includeStandard>{message}</MarkdownRenderer>
      </div>

      {children}
    </article>
  );
}
