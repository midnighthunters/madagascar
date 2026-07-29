import React from "react";
import { cn } from "#/utils/utils";
import { CopyToClipboardButton } from "#/components/shared/buttons/copy-to-clipboard-button";
import { OpenHandsSourceType } from "#/types/core/base";
import { StyledTooltip } from "#/components/shared/buttons/styled-tooltip";
import { MarkdownRenderer } from "../markdown/markdown-renderer";
import { AnimalAvatar } from "#/components/shared/animal-avatar";

interface ChatMessageProps {
  type: OpenHandsSourceType;
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
        "relative w-fit max-w-full last:mb-4 transition-all duration-300",
        "flex flex-col gap-2",
        type === "user" &&
          "p-4 rounded-[22px] rounded-br-md backdrop-blur-xl bg-blue-600/20 border border-blue-400/30 text-white self-end shadow-lg",
        type === "agent" &&
          "mt-4 p-4 rounded-[22px] rounded-bl-md backdrop-blur-2xl bg-neutral-900/65 border border-white/10 w-full max-w-full text-slate-100 shadow-xl",
        isFromPlanningAgent &&
          type === "agent" &&
          "border-amber-400/50 bg-amber-950/20 p-4 mt-2 shadow-[0_0_20px_rgba(245,158,11,0.15)]",
      )}
    >
      {/* Header Avatar Badge */}
      <div className="flex items-center gap-2 mb-1 border-b border-white/10 pb-2">
        {type === "agent" ? (
          <>
            <AnimalAvatar
              animal={isFromPlanningAgent ? "penguin" : "owl"}
              size="xs"
              status={isFromPlanningAgent ? "thinking" : "lead"}
            />
            {/* eslint-disable-next-line i18next/no-literal-string */}
            <span className="text-xs font-semibold text-amber-300">
              {isFromPlanningAgent ? "Planner Penguin" : "Wise Owl Lead AI"}
            </span>
          </>
        ) : (
          <>
            <AnimalAvatar animal="dog" size="xs" showBadge={false} />
            {/* eslint-disable-next-line i18next/no-literal-string */}
            <span className="text-xs font-semibold text-blue-300">User</span>
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
                className="p-1.5 rounded-full backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 text-white cursor-pointer"
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
              className="p-1.5 rounded-full backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 text-white cursor-pointer"
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
