import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { BrandButton } from "../settings/brand-button";
import { useCreateConversation } from "#/hooks/mutation/use-create-conversation";
import { useIsCreatingConversation } from "#/hooks/use-is-creating-conversation";
import PlusIcon from "#/icons/u-plus.svg?react";
import { AnimalAvatar } from "#/components/shared/animal-avatar";

export function NewConversation() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const {
    mutate: createConversation,
    isPending,
    isSuccess,
  } = useCreateConversation();
  const isCreatingConversationElsewhere = useIsCreatingConversation();

  const isCreatingConversation =
    isPending || isSuccess || isCreatingConversationElsewhere;

  return (
    <section className="w-full min-h-[300px] flex flex-col rounded-3xl p-6 gap-4 border border-white/20 backdrop-blur-2xl bg-neutral-900/70 shadow-2xl relative transition-all duration-300 hover:border-amber-400/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300">
            <PlusIcon width={18} height={18} />
          </div>
          <span className="leading-5 font-bold text-lg text-white">
            {t(I18nKey.COMMON$START_FROM_SCRATCH)}
          </span>
        </div>
      </div>

      <div>
        <span className="leading-[22px] text-sm font-normal text-white/80">
          {t(I18nKey.HOME$NEW_PROJECT_DESCRIPTION)}
        </span>
      </div>

      {/* Animal Agents Squad Display */}
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 my-1">
        {/* eslint-disable-next-line i18next/no-literal-string */}
        <span className="text-xs text-white/60 font-medium">Lead Squad:</span>
        <div className="flex items-center -space-x-2">
          <AnimalAvatar animal="owl" size="xs" status="lead" />
          <AnimalAvatar animal="dog" size="xs" status="online" />
          <AnimalAvatar animal="monkey" size="xs" status="online" />
          <AnimalAvatar animal="rabbit" size="xs" status="online" />
          <AnimalAvatar animal="penguin" size="xs" status="online" />
        </div>
        {/* eslint-disable-next-line i18next/no-literal-string */}
        <span className="text-xs font-semibold text-amber-300 ml-auto">
          Madagascar AI Team Ready
        </span>
      </div>

      <BrandButton
        testId="launch-new-conversation-button"
        variant="primary"
        type="button"
        onClick={() =>
          createConversation(
            {},
            {
              onSuccess: (data) =>
                navigate(`/conversations/${data.conversation_id}`),
            },
          )
        }
        isDisabled={isCreatingConversation}
        className="w-auto font-semibold rounded-2xl py-3 shadow-lg transition-transform hover:scale-[1.02]"
      >
        {!isCreatingConversation && "Launch Madagascar Animal AI IDE"}
        {isCreatingConversation && t("HOME$LOADING")}
      </BrandButton>
    </section>
  );
}
