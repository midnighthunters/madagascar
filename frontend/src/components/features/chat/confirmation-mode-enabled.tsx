import { useTranslation } from "react-i18next";
import { Tooltip } from "@heroui/react";
import { I18nKey } from "#/i18n/declaration";
import LockIcon from "#/icons/lock.svg?react";
import { useSettings } from "#/hooks/query/use-settings";

function ConfirmationModeEnabled() {
  const { t } = useTranslation();

  const { data: settings } = useSettings();

  if (!settings?.confirmation_mode) {
    return null;
  }

  return (
    <Tooltip
      content={t(I18nKey.COMMON$CONFIRMATION_MODE_ENABLED)}
      closeDelay={100}
      className="bg-surface-raised text-ink hover:bg-surface-muted"
    >
      <div className="flex items-center justify-center w-[26px] h-[26px] rounded-lg border border-line bg-surface-muted text-ink-secondary">
        <LockIcon width={15} height={15} />
      </div>
    </Tooltip>
  );
}

export default ConfirmationModeEnabled;
