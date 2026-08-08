import ClaudeMark from "#/assets/branding/claude-mark.svg?react";
import OpenAIMark from "#/assets/branding/openai-mark.svg?react";
import GeminiMark from "#/assets/branding/gemini-mark.svg?react";
import PuzzlePieceIcon from "#/icons/u-puzzle-piece.svg?react";
import type { AgentChipKind } from "#/utils/agent-display-label";

interface AgentChipIconProps {
  kind: AgentChipKind;
  className?: string;
}

const SIZE = 12;

/**
 * Brand mark for the conversation chip. Each harness gets its own recognisable
 * glyph: the Madagascar brand mark for native conversations, and the relevant provider
 * mark for known ACP servers (Claude, OpenAI/Codex, Gemini). Unknown ACP
 * providers fall back to a generic puzzle piece.
 */
export function AgentChipIcon({
  kind,
  className = "shrink-0",
}: AgentChipIconProps) {
  switch (kind) {
    case "madagascar":
      return (
        <span
          className={`font-bold text-[10px] leading-none text-amber-400 select-none ${className}`}
          data-testid="agent-chip-icon"
        >
          M
        </span>
      );
    case "acp-claude-code":
      return (
        <ClaudeMark
          width={SIZE}
          height={SIZE}
          className={className}
          data-testid="agent-chip-icon"
        />
      );
    case "acp-codex":
      return (
        <OpenAIMark
          width={SIZE}
          height={SIZE}
          className={className}
          data-testid="agent-chip-icon"
        />
      );
    case "acp-gemini-cli":
      return (
        <GeminiMark
          width={SIZE}
          height={SIZE}
          className={className}
          data-testid="agent-chip-icon"
        />
      );
    default:
      return (
        <PuzzlePieceIcon
          width={SIZE}
          height={SIZE}
          className={className}
          data-testid="agent-chip-icon"
        />
      );
  }
}
