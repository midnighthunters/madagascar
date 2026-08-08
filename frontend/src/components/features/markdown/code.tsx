import React from "react";
import { ExtraProps } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyableContentWrapper } from "#/components/shared/buttons/copyable-content-wrapper";
import { useTheme } from "#/hooks/use-theme";

// See https://github.com/remarkjs/react-markdown?tab=readme-ov-file#use-custom-components-syntax-highlight

/**
 * Component to render code blocks in markdown.
 */
export function Code({
  children,
  className,
}: React.ClassAttributes<HTMLElement> &
  React.HTMLAttributes<HTMLElement> &
  ExtraProps) {
  const { theme } = useTheme();
  const match = /language-(\w+)/.exec(className || ""); // get the language
  const codeString = String(children).replace(/\n$/, "");

  if (!match) {
    const isMultiline = String(children).includes("\n");

    if (!isMultiline) {
      return (
        <code
          className={className}
          className={`${className || ""} rounded border border-line bg-[var(--md-code-bg)] px-1.5 py-0.5 text-[var(--md-code-text)]`}
        >
          {children}
        </code>
      );
    }

    return (
      <CopyableContentWrapper text={codeString}>
        <pre
          className="overflow-auto rounded-lg border border-line bg-[var(--md-code-bg)] p-4 text-[var(--md-code-text)]"
        >
          <code className={className}>{codeString}</code>
        </pre>
      </CopyableContentWrapper>
    );
  }

  return (
    <CopyableContentWrapper text={codeString}>
      <SyntaxHighlighter
        className="rounded-lg"
        style={theme === "dark" ? vscDarkPlus : oneLight}
        language={match?.[1]}
        PreTag="div"
      >
        {codeString}
      </SyntaxHighlighter>
    </CopyableContentWrapper>
  );
}
