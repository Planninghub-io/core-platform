
import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileForm } from "./components/ProfileForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PreferencesTab from "./components/PreferencesTab";
import NotificationsTab from "./components/NotificationsTab";

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
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 bg-gradient-to-r from-violet-50/80 to-fuchsia-50/80">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <div className="p-6 rounded-lg bg-gradient-to-r from-violet-50/80 to-fuchsia-50/80 border border-purple-100">
            <h2 className="text-xl font-semibold mb-6 text-purple-900">Personal Information</h2>
            <ProfileForm userProfile={userProfile} refreshUserProfile={refreshUserProfile} />
          </div>
        </TabsContent>
        
        <TabsContent value="preferences">
          <PreferencesTab />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfileSettings;
