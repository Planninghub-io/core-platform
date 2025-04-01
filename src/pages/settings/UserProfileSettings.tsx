
import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileForm } from "./components/ProfileForm";

const UserProfileSettings = () => {
  const { userProfile, refreshUserProfile } = useUserProfile();

  if (!userProfile) {
    return (
      <div className="p-6 rounded-lg bg-gradient-to-r from-violet-50/80 to-fuchsia-50/80 border border-purple-100">
        <div className="flex justify-center items-center h-40">
          <p className="text-purple-800">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-lg bg-gradient-to-r from-violet-50/80 to-fuchsia-50/80 border border-purple-100">
        <h2 className="text-xl font-semibold mb-6 text-purple-900">Personal Information</h2>
        <ProfileForm userProfile={userProfile} refreshUserProfile={refreshUserProfile} />
      </div>
    </div>
  );
};

export default UserProfileSettings;
