
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
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          asChild
        >
          <Link to="/settings/profile">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </Button>
        <div className="flex items-center gap-3 p-2 rounded-md">
          <Avatar>
            <AvatarImage src={userProfile.avatar_url} />
            <AvatarFallback className="bg-primary/10">
              {getInitials(userProfile)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">
              {getDisplayName(userProfile)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
