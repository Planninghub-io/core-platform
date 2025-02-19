
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserProfile as IUserProfile } from "@/types/user";
import { getInitials, getDisplayName } from "@/utils/userUtils";

interface UserProfileProps {
  userProfile: IUserProfile;
}

export const UserProfile = ({ userProfile }: UserProfileProps) => {
  if (!userProfile) return null;

  return (
    <div className="p-4 border-t">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-md bg-gradient-to-r from-violet-100 to-fuchsia-100 shadow-sm hover:shadow-md transition-shadow duration-200">
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
            <span className="text-xs text-purple-600 truncate">
              {userProfile.email}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 bg-gradient-to-r from-purple-50 to-fuchsia-50 hover:from-purple-100 hover:to-fuchsia-100 text-purple-700"
          asChild
        >
          <Link to="/settings/profile">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
