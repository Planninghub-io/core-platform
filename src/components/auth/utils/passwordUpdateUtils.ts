
import { supabase } from "@/integrations/supabase/client";

// Function to set new password after reset
export const setNewPassword = async (
  password: string,
  toast: any,
  redirectCallback: () => void
) => {
  try {
    console.log("Setting new password");
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error("Password update error:", error);
      toast({
        title: "Password Update Error",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    toast({
      title: "Password Updated",
      description: "Your password has been successfully updated.",
    });
    
    redirectCallback();
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Password update exception:", error);
    toast({
      title: "Password Update Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: "An unexpected error occurred" };
  }
};
