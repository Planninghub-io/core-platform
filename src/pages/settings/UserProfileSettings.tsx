
import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileForm } from "./components/ProfileForm";

const UserProfileSettings = () => {
  const { userProfile, refreshUserProfile } = useUserProfile();

  if (!userProfile) {
    return (
      <div className="p-6 rounded-lg bg-gradient-to-r from-violet-50/80 to-fuchsia-50/80 border border-purple-100">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-lg bg-gradient-to-r from-violet-50/80 to-fuchsia-50/80 border border-purple-100">
        <ProfileForm userProfile={userProfile} refreshUserProfile={refreshUserProfile} />
      </div>
    </div>
  );
};

export default UserProfileSettings;
