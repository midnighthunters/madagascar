import { useTranslation } from "react-i18next";
import {
  BaseModalDescription,
  BaseModalTitle,
} from "#/components/shared/modals/confirmation-modals/base-modal";
import { ModalBackdrop } from "#/components/shared/modals/modal-backdrop";
import { ModalBody } from "#/components/shared/modals/modal-body";
import { BrandButton } from "../settings/brand-button";
import { I18nKey } from "#/i18n/declaration";
import { useConversationsInSandbox } from "#/hooks/query/use-conversations-in-sandbox";
import { AnimalAvatar } from "#/components/shared/animal-avatar";

interface ConfirmStopModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  sandboxId: string | null;
}

function ConversationsList({
  conversations,
  isLoading,
  isError,
  t,
}: {
  conversations: { id: string; title: string | null }[] | undefined;
  isLoading: boolean;
  isError: boolean;
  t: (key: string) => string;
}) {
  if (isLoading) {
    return (
      <div
        className="text-sm text-content-secondary"
        data-testid="conversations-loading"
      >
        {t(I18nKey.HOME$LOADING)}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-danger" data-testid="conversations-error">
        {t(I18nKey.COMMON$ERROR)}
      </div>
    );
  }

  if (conversations && conversations.length > 0) {
    return (
      <ul
        className="list-disc list-inside text-sm text-white/80"
        data-testid="conversations-list"
      >
        {conversations.map((conv) => (
          <li key={conv.id}>{conv.title || conv.id}</li>
        ))}
      </ul>
    );
  }

  return null;
}

export function ConfirmStopModal({
  onConfirm,
  onCancel,
  sandboxId,
}: ConfirmStopModalProps) {
  const { t } = useTranslation();
  const {
    data: conversations,
    isLoading,
    isError,
  } = useConversationsInSandbox(sandboxId);

  return (
    <ModalBackdrop onClose={onCancel}>
      <ModalBody className="items-start backdrop-blur-2xl bg-neutral-900/90 border border-white/20 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <AnimalAvatar animal="dog" size="sm" showBadge={false} />
          <div className="flex flex-col">
            <BaseModalTitle
              title={t(I18nKey.CONVERSATION$CONFIRM_CLOSE_CONVERSATION)}
            />
            <BaseModalDescription
              description={t(I18nKey.CONVERSATION$CLOSE_CONVERSATION_WARNING)}
            />
          </div>
        </div>
        <ConversationsList
          conversations={conversations}
          isLoading={isLoading}
          isError={isError}
          t={t}
        />
        <div
          className="flex flex-col gap-2.5 w-full mt-3"
          onClick={(event) => event.stopPropagation()}
        >
          <BrandButton
            type="button"
            variant="primary"
            onClick={onConfirm}
            className="w-full rounded-2xl py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold"
            data-testid="confirm-button"
          >
            {t(I18nKey.ACTION$CONFIRM_CLOSE)}
          </BrandButton>
          <BrandButton
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="w-full rounded-2xl py-2.5"
            data-testid="cancel-button"
          >
            {t(I18nKey.BUTTON$CANCEL)}
          </BrandButton>
        </div>
      </ModalBody>
    </ModalBackdrop>
  );
}
