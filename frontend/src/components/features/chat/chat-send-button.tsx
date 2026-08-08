import { ArrowUp } from "lucide-react";
import { cn } from "#/utils/utils";
import { Button } from "#/ui/button";

export interface ChatSendButtonProps {
  buttonClassName: string;
  handleSubmit: () => void;
  disabled: boolean;
}

export function ChatSendButton({
  buttonClassName,
  handleSubmit,
  disabled,
}: ChatSendButtonProps) {
  return (
    <Button
      type="button"
      variant="primary"
      size="icon"
      className={cn(
        "size-9 rounded-full",
        disabled
          ? "cursor-not-allowed"
          : "cursor-pointer",
        buttonClassName,
      )}
      data-name="arrow-up-circle-fill"
      data-testid="submit-button"
      onClick={handleSubmit}
      disabled={disabled}
    >
      <ArrowUp aria-hidden="true" />
    </Button>
  );
}
