import { ArrowUp } from "lucide-react";
import { cn } from "#/utils/utils";

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
    <button
      type="button"
      className={cn(
        "flex items-center justify-center rounded-xl border size-[35px] shadow-[0_2px_0_#DFE2E7]",
        disabled
          ? "cursor-not-allowed border-[#E7E9ED] bg-[#F0F2F5]"
          : "cursor-pointer border-[#C7AA42] bg-[#D7BC58] hover:-translate-y-0.5 hover:bg-[#DFC765] active:translate-y-0.5",
        buttonClassName,
      )}
      data-name="arrow-up-circle-fill"
      data-testid="submit-button"
      onClick={handleSubmit}
      disabled={disabled}
    >
      <ArrowUp color={disabled ? "#9AA0A8" : "#342B0E"} />
    </button>
  );
}
