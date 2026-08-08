import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "#/components/shared/loading-spinner";
import { cn } from "#/utils/utils";
import { Avatar } from "./avatar";
import { AnimalAvatar } from "#/components/shared/animal-avatar";

interface UserAvatarProps {
  avatarUrl?: string;
  isLoading?: boolean;
}

export function UserAvatar({ avatarUrl, isLoading }: UserAvatarProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      data-testid="user-avatar"
      aria-label={t("SETTINGS$ALL")}
      className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-[transform,box-shadow] hover:-translate-y-0.5 bg-white border border-[#D8DCE2] shadow-[0_2px_0_#DFE2E7] p-0.5",
        isLoading && "bg-transparent",
      )}
    >
      {!isLoading && avatarUrl && <Avatar src={avatarUrl} />}
      {!isLoading && !avatarUrl && (
        <AnimalAvatar animal="owl" size="xs" showBadge={false} />
      )}
      {isLoading && <LoadingSpinner size="small" />}
    </button>
  );
}
