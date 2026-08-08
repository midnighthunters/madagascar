import React from "react";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useGitUser } from "#/hooks/query/use-git-user";
import { UserActions } from "./user-actions";
import { MadagascarLogoButton } from "#/components/shared/buttons/madagascar-logo-button";
import { NewProjectButton } from "#/components/shared/buttons/new-project-button";
import { ConversationPanelButton } from "#/components/shared/buttons/conversation-panel-button";
import { AutomationsButton } from "#/components/shared/buttons/automations-button";
import { SettingsModal } from "#/components/shared/modals/settings/settings-modal";
import { useSettings } from "#/hooks/query/use-settings";
import { ConversationPanel } from "../conversation-panel/conversation-panel";
import { ConversationPanelWrapper } from "../conversation-panel/conversation-panel-wrapper";
import { useConfig } from "#/hooks/query/use-config";
import { displayErrorToast } from "#/utils/custom-toast-handlers";
import { I18nKey } from "#/i18n/declaration";
import { cn } from "#/utils/utils";

export function Sidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const user = useGitUser();
  const { data: config } = useConfig();
  const {
    data: settings,
    error: settingsError,
    isError: settingsIsError,
    isFetching: isFetchingSettings,
  } = useSettings();

  const [settingsModalIsOpen, setSettingsModalIsOpen] = React.useState(false);

  const [conversationPanelIsOpen, setConversationPanelIsOpen] =
    React.useState(false);

  React.useEffect(() => {
    if (pathname === "/settings") {
      setSettingsModalIsOpen(false);
    } else if (
      !isFetchingSettings &&
      settingsIsError &&
      settingsError?.status !== 404
    ) {
      displayErrorToast(
        "Something went wrong while fetching settings. Please reload the page.",
      );
    } else if (
      config?.app_mode === "oss" &&
      settingsError?.status === 404 &&
      !config?.feature_flags?.hide_llm_settings
    ) {
      setSettingsModalIsOpen(true);
    }
  }, [
    pathname,
    isFetchingSettings,
    settingsIsError,
    settingsError,
    config?.app_mode,
    config?.feature_flags?.hide_llm_settings,
  ]);

  return (
    <>
      <aside
        aria-label={t(I18nKey.SIDEBAR$NAVIGATION_LABEL)}
        className={cn(
          "h-[54px] px-3 py-2 md:px-3 md:py-4 md:h-full flex flex-row md:flex-col bg-white border-b md:border-b-0 md:border-r border-[#E7E9ED] md:w-[224px] md:min-w-[224px] z-40",
          pathname === "/" && "md:py-4",
        )}
      >
        <nav className="flex flex-row md:flex-col items-center md:items-stretch justify-between w-full h-auto md:h-full gap-3">
          <div className="flex flex-row md:flex-col items-center md:items-stretch gap-2">
            <div className="flex items-center justify-center md:justify-start md:mb-3">
              <MadagascarLogoButton />
            </div>
            <div className="flex items-center justify-center md:block">
              <NewProjectButton disabled={settings?.email_verified === false} />
            </div>
            <ConversationPanelButton
              isOpen={conversationPanelIsOpen}
              onClick={() =>
                settings?.email_verified === false
                  ? null
                  : setConversationPanelIsOpen((prev) => !prev)
              }
              disabled={settings?.email_verified === false}
            />
            {config?.feature_flags?.enable_automations && (
              <AutomationsButton
                disabled={settings?.email_verified === false}
              />
            )}
          </div>

          <div className="flex flex-row md:flex-col md:items-stretch md:border-t md:border-[#E7E9ED] md:pt-3 gap-2">
            <UserActions
              user={
                user.data ? { avatar_url: user.data.avatar_url } : undefined
              }
              isLoading={user.isFetching}
            />
          </div>
        </nav>

        {conversationPanelIsOpen && (
          <ConversationPanelWrapper isOpen={conversationPanelIsOpen}>
            <ConversationPanel
              onClose={() => setConversationPanelIsOpen(false)}
            />
          </ConversationPanelWrapper>
        )}
      </aside>

      {settingsModalIsOpen && (
        <SettingsModal
          settings={settings}
          onClose={() => setSettingsModalIsOpen(false)}
        />
      )}
    </>
  );
}
