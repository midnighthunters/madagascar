import React from "react";
import { DragOver } from "../drag-over";
import { UploadedFiles } from "../uploaded-files";
import { ChatInputRow } from "./chat-input-row";
import { ChatInputActions } from "./chat-input-actions";
import { SlashCommandMenu } from "./slash-command-menu";
import { useConversationStore } from "#/stores/conversation-store";
import { cn } from "#/utils/utils";
import { SlashCommandItem } from "#/hooks/chat/use-slash-command";

interface ChatInputContainerProps {
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  isDragOver: boolean;
  disabled: boolean;
  isNewConversationPending?: boolean;
  showButton: boolean;
  buttonClassName: string;
  chatInputRef: React.RefObject<HTMLDivElement | null>;
  handleFileIconClick: (isDisabled: boolean) => void;
  handleSubmit: () => void;
  onDragOver: (e: React.DragEvent, isDisabled: boolean) => void;
  onDragLeave: (e: React.DragEvent, isDisabled: boolean) => void;
  onDrop: (e: React.DragEvent, isDisabled: boolean) => void;
  onInput: () => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isSlashMenuOpen?: boolean;
  slashItems?: SlashCommandItem[];
  slashSelectedIndex?: number;
  onSlashSelect?: (item: SlashCommandItem) => void;
}

export function ChatInputContainer({
  chatContainerRef,
  isDragOver,
  disabled,
  isNewConversationPending = false,
  showButton,
  buttonClassName,
  chatInputRef,
  handleFileIconClick,
  handleSubmit,
  onDragOver,
  onDragLeave,
  onDrop,
  onInput,
  onPaste,
  onKeyDown,
  onFocus,
  onBlur,
  isSlashMenuOpen = false,
  slashItems = [],
  slashSelectedIndex = 0,
  onSlashSelect,
}: ChatInputContainerProps) {
  const conversationMode = useConversationStore(
    (state) => state.conversationMode,
  );

  return (
    <div
      ref={chatContainerRef}
      className={cn(
        "bg-white border-[1.5px] border-[#D8DCE2] shadow-[0_4px_0_#DFE2E7,0_8px_18px_rgba(20,30,50,0.04)] box-border flex flex-col items-start justify-center p-3.5 relative rounded-2xl w-full transition-[border-color,box-shadow,transform] duration-150 focus-within:border-[#C2A33A] focus-within:shadow-[0_4px_0_#D7BC58,0_8px_18px_rgba(20,30,50,0.05)]",
        conversationMode === "plan" &&
          "border-[#D7BC58] shadow-[0_4px_0_#C7AA42]",
      )}
      onDragOver={(e) => onDragOver(e, disabled)}
      onDragLeave={(e) => onDragLeave(e, disabled)}
      onDrop={(e) => onDrop(e, disabled)}
    >
      {/* Drag Over UI */}
      {isDragOver && <DragOver />}

      <UploadedFiles />

      {/* Wrapper for slash menu */}
      <div className="relative w-full">
        {isSlashMenuOpen && onSlashSelect && (
          <SlashCommandMenu
            items={slashItems}
            selectedIndex={slashSelectedIndex}
            onSelect={onSlashSelect}
          />
        )}

        <ChatInputRow
          chatInputRef={chatInputRef}
          disabled={disabled}
          isNewConversationPending={isNewConversationPending}
          showButton={showButton}
          buttonClassName={buttonClassName}
          handleFileIconClick={handleFileIconClick}
          handleSubmit={handleSubmit}
          onInput={onInput}
          onPaste={onPaste}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>

      <ChatInputActions disabled={disabled} />
    </div>
  );
}
