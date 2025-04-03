
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { ProfileSetupForm } from "./components/ProfileSetupForm";

const ProfileSetup = () => {
  const { user, loading } = useAuthRedirect({ skipRedirect: true });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-lg">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h1>
          <p className="text-gray-600 mb-6 text-center">Please provide some additional information to complete your profile setup.</p>
          
          <ProfileSetupForm user={user} />
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
