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
        "text-[#6F7680] bg-white border-transparent",
        isActive &&
          "bg-[#F0E8C4] text-[#4B3D12] border-[#D7BC58] shadow-[0_2px_0_#D7BC58]",
        isActive
          ? "hover:text-[#4B3D12] hover:bg-[#ECE1B4]"
          : "hover:text-[#272B30] hover:bg-[#F3F4F6] hover:border-[#E7E9ED]",
        isActive
          ? "focus-within:text-[#4B3D12]"
          : "focus-within:text-[#272B30]",
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
