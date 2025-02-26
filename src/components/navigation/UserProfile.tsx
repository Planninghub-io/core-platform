
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserProfile as IUserProfile } from "@/types/user";
import { getInitials, getDisplayName } from "@/utils/userUtils";

interface UserProfileProps {
  userProfile: IUserProfile;
}

export const UserProfile = ({ userProfile }: UserProfileProps) => {
  if (!userProfile) return null;

  return (
    <div className="p-4 cursor-pointer hover:bg-accent/10 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
          <AvatarImage src={userProfile.avatar_url} />
          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-fuchsia-500 text-white">
            {getInitials(userProfile)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate text-purple-900">
            {getDisplayName(userProfile)}
          </span>
        </div>
      </div>
    </div>
  );
};
