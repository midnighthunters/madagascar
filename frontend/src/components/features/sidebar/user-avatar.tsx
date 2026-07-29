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
      className={cn(
        "w-9 h-9 rounded-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 backdrop-blur-xl bg-white/10 border border-white/20 shadow-md p-0.5",
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
