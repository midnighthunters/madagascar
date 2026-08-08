import React from "react";
import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import PlusIcon from "#/icons/u-plus.svg?react";
import { CardTitle } from "#/ui/card-title";
import { Typography } from "#/ui/typography";
import { CreateConversationButton } from "./create-conversation-button";
import { Card } from "#/ui/card";

export function NewConversation() {
  const { t } = useTranslation();
  const [query, setQuery] = React.useState("");

  return (
    <Card className="flex-[1.35] flex-col p-5 sm:p-6 min-h-[300px] w-full">
      <div className="flex items-center justify-between gap-4">
        <CardTitle icon={<PlusIcon width={17} height={14} />}>
          {t(I18nKey.COMMON$START_FROM_SCRATCH)}
        </CardTitle>
        <span className="rounded-lg bg-[#F0E8C4] px-2 py-1 text-[11px] font-semibold text-[#665318]">
          {/* eslint-disable-next-line i18next/no-literal-string */}
          NEW TASK
        </span>
      </div>
      <Typography.Text className="mt-2 text-[#6F7680]">
        {t(I18nKey.HOME$NEW_PROJECT_DESCRIPTION)}
      </Typography.Text>
      <textarea
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t(I18nKey.CHAT_INTERFACE$INPUT_PLACEHOLDER)}
        aria-label={t(I18nKey.CHAT_INTERFACE$MESSAGE_ARIA_LABEL)}
        className="mt-5 min-h-28 w-full flex-1 resize-none rounded-2xl border-[1.5px] border-[#D8DCE2] bg-[#FBFBFC] px-4 py-3 text-[15px] leading-6 text-[#272B30] placeholder:text-[#9AA0A8] shadow-[inset_0_1px_2px_rgba(20,30,50,0.03)] outline-none transition-colors focus:border-[#C2A33A] focus:bg-white focus:ring-3 focus:ring-[#D7BC58]/20"
      />
      <div className="mt-4 flex items-center justify-between gap-4">
        <span className="hidden sm:block text-xs text-[#8A919A]">
          {/* eslint-disable-next-line i18next/no-literal-string */}
          You can add files and context after launch.
        </span>
        <CreateConversationButton query={query.trim() || undefined} />
      </div>
    </Card>
  );
}
