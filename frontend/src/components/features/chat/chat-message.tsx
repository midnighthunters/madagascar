import React from "react";
import { cn } from "#/utils/utils";
import { CopyToClipboardButton } from "#/components/shared/buttons/copy-to-clipboard-button";
import { MadagascarSourceType } from "#/types/core/base";
import { StyledTooltip } from "#/components/shared/buttons/styled-tooltip";
import { MarkdownRenderer } from "../markdown/markdown-renderer";
import { AnimalAvatar } from "#/components/shared/animal-avatar";
import { Button } from "#/ui/button";

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

/* eslint-disable i18next/no-literal-string */
export function ChatMessage({
  type,
  message,
  children,
  actions,
  isFromPlanningAgent = false,
}: React.PropsWithChildren<ChatMessageProps>) {
  const [isHovering, setIsHovering] = React.useState(false);
  const [isCopy, setIsCopy] = React.useState(false);
  const isUser = type === "user";

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(message);
    setIsCopy(true);
  };

  React.useEffect(() => {
    if (!isCopy) return undefined;
    const timeout = setTimeout(() => setIsCopy(false), 2000);
    return () => clearTimeout(timeout);
  }, [isCopy]);

  const bubble = (
    <div
      className={cn(
        "relative min-w-0 px-4 py-3 text-sm leading-relaxed",
        isUser &&
          "rounded-[20px] rounded-br-[6px] bg-user-bubble text-ink-inverse shadow-[0_1px_2px_var(--md-shadow-color)]",
        !isUser &&
          "rounded-[20px] rounded-bl-[6px] border border-line bg-assistant-bubble text-ink shadow-[var(--md-shadow-card)]",
        !isUser && isFromPlanningAgent &&
          "border-[var(--md-planning-border)] bg-planning-bubble",
      )}
    >
      {!isUser && (
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.02em] text-ink-secondary">
          {isFromPlanningAgent ? "Penguin · Planner" : "Owl · Lead agent"}
        </div>
      )}

      <div
        className={cn("absolute -top-3 z-20 items-center gap-1", isUser ? "-left-3" : "-right-3", !isHovering ? "hidden" : "flex")}
      >
        {actions?.map((action, index) => {
          const actionButton = (
            <Button
              key={action.tooltip || index}
              variant="icon"
              size="icon"
              onClick={action.onClick}
              className="size-8"
              aria-label={action.tooltip || `Action ${index + 1}`}
            >
              {action.icon}
            </Button>
          );
          return action.tooltip ? (
            <StyledTooltip key={action.tooltip} content={action.tooltip} placement="top">
              {actionButton}
            </StyledTooltip>
          ) : actionButton;
        })}
        <CopyToClipboardButton
          isHidden={!isHovering}
          isDisabled={isCopy}
          onClick={handleCopyToClipboard}
          mode={isCopy ? "copied" : "copy"}
        />
      </div>

      <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
        <MarkdownRenderer includeStandard>{message}</MarkdownRenderer>
      </div>
      {children}
    </div>
  );

  return (
    <article
      data-testid={`${type}-message`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "relative mb-1 flex w-full last:mb-5",
        isUser ? "justify-end pl-[18%]" : "justify-start pr-[12%]",
      )}
    >
      {isUser ? (
        <div className="max-w-full sm:max-w-[82%]">{bubble}</div>
      ) : (
        <div className="flex max-w-full items-start gap-2.5 sm:max-w-[88%]">
          <AnimalAvatar
            animal={isFromPlanningAgent ? "penguin" : "owl"}
            size="md"
            status={isFromPlanningAgent ? "thinking" : "lead"}
            className="mt-1"
          />
          {bubble}
        </div>
      )}
    </article>
  );
}
