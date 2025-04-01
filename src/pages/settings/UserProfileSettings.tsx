
import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileForm } from "./components/ProfileForm";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const UserProfileSettings = () => {
  const { userProfile, refreshUserProfile } = useUserProfile();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      // Call the delete_current_user function using a raw POST request to work around type issues
      const { error } = await supabase.functions.invoke('delete-user-account');
      
      if (error) {
        throw error;
      }
      
      // Show success message
      toast({
        title: "Account deleted",
        description: "Your account and all associated data have been deleted.",
      });
      
      // Sign out and redirect to home page
      await supabase.auth.signOut();
      navigate("/", { replace: true });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
      
      <div className="p-6 rounded-lg bg-gradient-to-r from-red-50/50 to-pink-50/50 border border-red-100">
        <h2 className="text-xl font-semibold mb-6 text-red-800">Danger Zone</h2>
        <p className="text-gray-600 mb-4">
          Deleting your account will remove all your data from our system. This action cannot be undone.
        </p>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete My Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete your account and all associated data, including:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>All your events</li>
                  <li>Invitations and contacts</li>
                  <li>Tickets and purchases</li>
                  <li>Personal profile information</li>
                </ul>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete My Account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default UserProfileSettings;
