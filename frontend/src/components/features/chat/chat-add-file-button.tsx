import PaperclipIcon from "#/icons/paper-clip.svg?react";
import { cn } from "#/utils/utils";
import { Button } from "#/ui/button";

export interface ChatAddFileButtonProps {
  handleFileIconClick: () => void;
  disabled?: boolean;
}

export function ChatAddFileButton({
  handleFileIconClick,
  disabled = false,
}: ChatAddFileButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "size-9 relative shrink-0 rounded-full text-ink-secondary",
        disabled && "cursor-not-allowed",
      )}
      data-name="Shape"
      data-testid="paperclip-icon"
      onClick={handleFileIconClick}
    >
      <PaperclipIcon
        className="block max-w-none w-[13px] h-[25px]"
        color="currentColor"
      />
    </Button>
  );
}
