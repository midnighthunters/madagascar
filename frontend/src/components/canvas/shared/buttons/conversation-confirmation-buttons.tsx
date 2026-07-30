/* eslint-disable i18next/no-literal-string -- This Madagascar review label has no equivalent legacy catalog key. */
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { AgentState } from "#/types/agent-state";
import { ActionTooltip } from "../action-tooltip";
import { RiskAlert } from "#/components/shared/risk-alert";
import WarningIcon from "#/icons/u-warning.svg?react";
import { useEventMessageStore } from "#/stores/event-message-store";
import { useEventStore } from "#/stores/use-event-store";
import { isActionEvent } from "#/types/agent-server/type-guards";
import { useActiveConversation } from "#/hooks/query/use-active-conversation";
import { useAgentState } from "#/hooks/use-agent-state";
import { useRespondToConfirmation } from "#/hooks/mutation/use-respond-to-confirmation";
import { SecurityRisk } from "#/types/agent-server/core/base/common";
import { useMadagascarStore } from "#/stores/madagascar-store";

function toApprovalRisk(
  risk: SecurityRisk,
): "low" | "medium" | "high" | "unknown" {
  if (risk === SecurityRisk.HIGH) return "high";
  if (risk === SecurityRisk.MEDIUM) return "medium";
  if (risk === SecurityRisk.LOW) return "low";
  return "unknown";
}

export function ConversationConfirmationButtons() {
  const submittedEventIds = useEventMessageStore(
    (state) => state.submittedEventIds,
  );
  const addSubmittedEventId = useEventMessageStore(
    (state) => state.addSubmittedEventId,
  );

  const { t } = useTranslation("madagascar");
  const { data: conversation } = useActiveConversation();
  const { curAgentState } = useAgentState();
  const { mutate: respondToConfirmation } = useRespondToConfirmation();
  const createApproval = useMadagascarStore((state) => state.createApproval);
  const updateApproval = useMadagascarStore((state) => state.updateApproval);
  const events = useEventStore((state) => state.events);

  const awaitingAction = events
    .slice()
    .reverse()
    .find((ev) => {
      if (ev.source !== "agent") return false;
      return curAgentState === AgentState.AWAITING_USER_CONFIRMATION;
    });

  const handleConfirmation = useCallback(
    (accept: boolean) => {
      if (!awaitingAction || !conversation) {
        return;
      }

      // Mark event as submitted to prevent duplicate submissions
      addSubmittedEventId(awaitingAction.id);

      const actionName = isActionEvent(awaitingAction)
        ? awaitingAction.action
        : "agent action";
      const actionRisk = isActionEvent(awaitingAction)
        ? awaitingAction.security_risk
        : SecurityRisk.UNKNOWN;
      const approvalId = createApproval(
        conversation.id,
        `Confirmation requested for ${actionName}`,
        {
          kind: "agent-action",
          risk: toApprovalRisk(actionRisk),
          sourceEventId: awaitingAction.id,
          preview: JSON.stringify(
            isActionEvent(awaitingAction)
              ? awaitingAction.action
              : awaitingAction,
            null,
            2,
          ),
        },
      );
      respondToConfirmation(
        {
          conversationId: conversation.id,
          conversationUrl: conversation.conversation_url || "",
          sessionApiKey: conversation.session_api_key,
          accept,
        },
        {
          onSuccess: () =>
            updateApproval(approvalId, accept ? "approved" : "rejected"),
          onError: () => updateApproval(approvalId, "rejected"),
        },
      );
    },
    [
      awaitingAction,
      conversation,
      addSubmittedEventId,
      createApproval,
      respondToConfirmation,
      updateApproval,
    ],
  );

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!awaitingAction) {
      return undefined;
    }

    const handleCancelShortcut = (event: KeyboardEvent) => {
      if (
        event.shiftKey &&
        (event.metaKey || event.ctrlKey) &&
        event.key === "Backspace"
      ) {
        event.preventDefault();
        handleConfirmation(false);
      }
    };

    const handleContinueShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        handleConfirmation(true);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Cancel: Shift+Cmd+Backspace (⇧⌘⌫)
      handleCancelShortcut(event);
      // Continue: Cmd+Enter (⌘↩)
      handleContinueShortcut(event);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [awaitingAction, handleConfirmation]);

  // Only show if agent is waiting for confirmation and we haven't already submitted
  if (
    curAgentState !== AgentState.AWAITING_USER_CONFIRMATION ||
    !awaitingAction ||
    submittedEventIds.includes(awaitingAction.id)
  ) {
    return null;
  }

  // Get security risk from the action (only ActionEvent has security_risk)
  const risk = isActionEvent(awaitingAction)
    ? awaitingAction.security_risk
    : SecurityRisk.UNKNOWN;

  const isHighRisk = risk === SecurityRisk.HIGH;

  return (
    <div className="flex flex-col gap-2 pt-4">
      {isHighRisk && (
        <RiskAlert
          content={t(I18nKey.CHAT_INTERFACE$HIGH_RISK_WARNING)}
          icon={<WarningIcon width={16} height={16} color="#fff" />}
          severity="high"
          title={t(I18nKey.COMMON$HIGH_RISK)}
        />
      )}
      <details className="text-xs text-gray-300">
        <summary className="cursor-pointer">
          Review planned action before continuing
        </summary>
        <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-black/20 p-2">
          {JSON.stringify(
            isActionEvent(awaitingAction)
              ? awaitingAction.action
              : awaitingAction,
            null,
            2,
          )}
        </pre>
      </details>
      <div className="flex justify-between items-center">
        <p className="text-sm font-normal text-white">
          {t(I18nKey.CHAT_INTERFACE$USER_ASK_CONFIRMATION)}
        </p>
        <div className="flex items-center gap-3">
          <ActionTooltip
            type="reject"
            onClick={() => handleConfirmation(false)}
          />
          <ActionTooltip
            type="confirm"
            onClick={() => handleConfirmation(true)}
          />
        </div>
      </div>
    </div>
  );
}
