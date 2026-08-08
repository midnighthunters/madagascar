import { DiffEditor, Editor, Monaco } from "@monaco-editor/react";
import React from "react";
import { editor as editor_t } from "monaco-editor";
import {
  LuFileDiff,
  LuFileMinus,
  LuFilePlus,
  LuHistory,
  LuGitCompareArrows,
  LuFileCheck,
} from "react-icons/lu";
import { IconType } from "react-icons/lib";
import { GitChangeStatus } from "#/api/open-hands.types";
import { getLanguageFromPath } from "#/utils/get-language-from-path";
import { cn } from "#/utils/utils";
import ChevronUp from "#/icons/chveron-up.svg?react";
import { useUnifiedGitDiff } from "#/hooks/query/use-unified-git-diff";
import { MarkdownRenderer } from "#/components/features/markdown/markdown-renderer";
import { Typography } from "#/ui/typography";
import { LoadingSpinner } from "./loading-spinner";
import { EditorContainer } from "./editor-container";
import { useTheme } from "#/hooks/use-theme";
import { Button } from "#/ui/button";

type ViewMode = "diff" | "old" | "new";

const VIEW_MODES: { mode: ViewMode; icon: IconType }[] = [
  { mode: "old", icon: LuHistory },
  { mode: "diff", icon: LuGitCompareArrows },
  { mode: "new", icon: LuFileCheck },
];

const SHARED_EDITOR_OPTIONS: editor_t.IEditorOptions = {
  renderValidationDecorations: "off",
  readOnly: true,
  scrollBeyondLastLine: false,
  minimap: { enabled: false },
  automaticLayout: true,
  scrollbar: { alwaysConsumeMouseWheel: false },
};

const STATUS_MAP: Record<GitChangeStatus, string | IconType> = {
  A: LuFilePlus,
  D: LuFileMinus,
  M: LuFileDiff,
  R: "Renamed",
  U: "Untracked",
};

export interface FileDiffViewerProps {
  path: string;
  type: GitChangeStatus;
}

export function FileDiffViewer({ path, type }: FileDiffViewerProps) {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const [editorHeight, setEditorHeight] = React.useState(400);
  const [viewMode, setViewMode] = React.useState<ViewMode>("diff");
  const diffEditorRef = React.useRef<editor_t.IStandaloneDiffEditor>(null);
  const singleEditorRef = React.useRef<editor_t.IStandaloneCodeEditor>(null);

  const isAdded = type === "A" || type === "U";
  const isDeleted = type === "D";

  const filePath = React.useMemo(() => {
    if (type === "R") {
      const parts = path.split(/\s+/).slice(1);
      return parts[parts.length - 1];
    }
    return path;
  }, [path, type]);

  const {
    data: diff,
    isLoading,
    isSuccess,
    isRefetching,
  } = useUnifiedGitDiff({
    filePath,
    type,
    enabled: !isCollapsed,
  });

  const updateEditorHeight = React.useCallback(() => {
    if (!diffEditorRef.current) return;
    const originalEditor = diffEditorRef.current.getOriginalEditor();
    const modifiedEditor = diffEditorRef.current.getModifiedEditor();
    if (originalEditor && modifiedEditor) {
      setEditorHeight(
        Math.max(
          originalEditor.getContentHeight(),
          modifiedEditor.getContentHeight(),
        ) + 20,
      );
    }
  }, []);

  const updateSingleEditorHeight = React.useCallback(() => {
    if (singleEditorRef.current) {
      setEditorHeight(singleEditorRef.current.getContentHeight() + 20);
    }
  }, []);

  const handleDiffEditorMount = (editor: editor_t.IStandaloneDiffEditor) => {
    diffEditorRef.current = editor;
    updateEditorHeight();
    editor.getOriginalEditor().onDidContentSizeChange(updateEditorHeight);
    editor.getModifiedEditor().onDidContentSizeChange(updateEditorHeight);
  };

  const handleSingleEditorMount = (editor: editor_t.IStandaloneCodeEditor) => {
    singleEditorRef.current = editor;
    updateSingleEditorHeight();
    editor.onDidContentSizeChange(updateSingleEditorHeight);
  };

  const status = (type === "U" ? STATUS_MAP.A : STATUS_MAP[type]) || "?";
  const statusIcon =
    typeof status === "string" ? (
      <Typography.Text>{status}</Typography.Text>
    ) : (
      React.createElement(status, { className: "w-5 h-5" })
    );

  const isFetchingData = isLoading || isRefetching;
  const language = getLanguageFromPath(filePath);
  const isMarkdownFile = language === "markdown";
  const singleViewContent =
    viewMode === "old" ? (diff?.original ?? "") : (diff?.modified ?? "");
  const editorTheme = `madagascar-${theme}`;

  const beforeMount = React.useCallback(
    (monaco: Monaco) => {
      const styles = window.getComputedStyle(document.documentElement);
      const color = (token: string) => styles.getPropertyValue(token).trim();
      const withoutHash = (value: string) => value.replace("#", "");
      monaco.editor.defineTheme(editorTheme, {
        base: theme === "dark" ? "vs-dark" : "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": color("--md-editor"),
          "editor.foreground": color("--md-text"),
          "editorWidget.background": color("--md-editor-raised"),
          "editorWidget.border": color("--md-border"),
          "diffEditor.insertedLineBackground": `${withoutHash(color("--md-diff-added"))}AA`,
          "diffEditor.removedLineBackground": `${withoutHash(color("--md-diff-removed"))}AA`,
          "diffEditor.border": color("--md-border-strong"),
          "editorUnnecessaryCode.border": "#00000000",
        },
      });
    },
    [editorTheme, theme],
  );

  const renderContent = () => {
    if (viewMode === "diff") {
      return (
        <EditorContainer height={editorHeight}>
          <DiffEditor
            data-testid="file-diff-viewer"
            className="w-full h-full"
            language={language}
            original={isAdded ? "" : (diff?.original ?? "")}
            modified={isDeleted ? "" : (diff?.modified ?? "")}
            theme={editorTheme}
            onMount={handleDiffEditorMount}
            beforeMount={beforeMount}
            options={{
              ...SHARED_EDITOR_OPTIONS,
              renderSideBySide: !isAdded && !isDeleted,
              hideUnchangedRegions: { enabled: true },
            }}
          />
        </EditorContainer>
      );
    }

    if (isMarkdownFile) {
      return (
        <div
          className="w-full border border-line-strong overflow-auto p-4 bg-editor text-ink prose max-w-none"
          data-testid="markdown-preview"
        >
          <MarkdownRenderer
            content={singleViewContent}
            includeStandard
            includeHeadings
          />
        </div>
      );
    }

    return (
      <EditorContainer height={editorHeight}>
        <Editor
          data-testid="file-single-viewer"
          className="w-full h-full"
          language={language}
          value={singleViewContent}
          theme={editorTheme}
          beforeMount={beforeMount}
          onMount={handleSingleEditorMount}
          options={SHARED_EDITOR_OPTIONS}
        />
      </EditorContainer>
    );
  };

  return (
    <div data-testid="file-diff-viewer-outer" className="w-full flex flex-col">
      <div
        className={cn(
          "flex justify-between items-center px-2.5 py-3.5 border border-line-strong bg-editor-raised rounded-xl hover:cursor-pointer",
          !isCollapsed && !isLoading && "border-b-0 rounded-b-none",
        )}
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        <span className="text-sm w-full text-content flex items-center gap-2">
          {isFetchingData ? <LoadingSpinner className="w-5 h-5" /> : statusIcon}
          <strong className="w-full truncate">{filePath}</strong>
          {!isCollapsed && (
            <span
              className="flex items-center gap-0.5 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {VIEW_MODES.map(({ mode, icon: Icon }) => (
                <Button
                  key={mode}
                  data-testid={`view-mode-${mode}`}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "size-7",
                    viewMode === mode
                      ? "bg-action-soft text-action"
                      : "text-ink-muted",
                  )}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              ))}
            </span>
          )}
          <Button data-testid="collapse" type="button" variant="ghost" size="icon" className="size-7">
            <ChevronUp
              className={cn(
                "w-4 h-4 transition-transform",
                isCollapsed && "transform rotate-180",
              )}
            />
          </Button>
        </span>
      </div>

      {isSuccess && !isCollapsed && renderContent()}
    </div>
  );
}
