
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserProfile as IUserProfile } from "@/types/user";
import { getInitials, getDisplayName } from "@/utils/userUtils";
import { User } from "lucide-react";

interface UserProfileProps {
  userProfile: IUserProfile;
}

export const UserProfile = ({ userProfile }: UserProfileProps) => {
  if (!userProfile) return null;

  return (
    <div className="p-4 cursor-pointer hover:bg-accent/10 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
          {userProfile.avatar_url ? (
            <AvatarImage src={userProfile.avatar_url} alt={getDisplayName(userProfile)} />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-fuchsia-500 text-white">
              {getInitials(userProfile) || <User className="h-5 w-5" />}
            </AvatarFallback>
          )}
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
