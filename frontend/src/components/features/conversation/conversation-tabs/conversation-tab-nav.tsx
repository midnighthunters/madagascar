import { ComponentType } from "react";
import { cn } from "#/utils/utils";

type ConversationTabNavProps = {
  tabValue: string;
  icon: ComponentType<{ className: string }>;
  onClick(): void;
  isActive?: boolean;
  label?: string;
  className?: string;
};

export function ConversationTabNav({
  tabValue,
  icon: Icon,
  onClick,
  isActive,
  label,
  className,
}: ConversationTabNavProps) {
  return (
    <button
      type="button"
      onClick={() => {
        onClick();
      }}
      data-testid={`conversation-tab-${tabValue}`}
      className={cn(
        "flex min-h-9 items-center gap-2 rounded-xl cursor-pointer border",
        "px-2.5 py-1.5",
        "text-ink-secondary bg-surface border-transparent",
        isActive &&
          "bg-action-soft text-action border-action shadow-[var(--md-shadow-control)]",
        isActive
          ? "hover:text-action hover:bg-action-soft"
          : "hover:text-ink hover:bg-surface-muted hover:border-line",
        isActive
          ? "focus-within:text-action"
          : "focus-within:text-ink",
        className,
      )}
    >
      <Icon className={cn("w-5 h-5 text-inherit flex-shrink-0")} />
      {isActive && label && (
        <span className="text-sm font-medium whitespace-nowrap">{label}</span>
      )}
    </button>
  );
}
