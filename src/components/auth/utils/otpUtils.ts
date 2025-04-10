
import { supabase, APP_URL } from "@/integrations/supabase/client";

// Handle OTP verification
export const verifyOTP = async (
  email: string, 
  token: string,
  toast: any,
  redirectCallback: () => void
) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });

    if (error) {
      toast({
        title: "Verification Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success!",
      description: "Your account has been verified.",
    });
    
    redirectCallback();
    return true;
  } catch (error: any) {
    toast({
      title: "Verification Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Function to send OTP for password reset
export const sendPasswordResetOTP = async (
  email: string,
  toast: any
) => {
  try {
    // First, ensure the custom email template is set up
    await setupCustomEmailTemplate();
    
    // Use the environment-aware APP_URL
    const redirectTo = `${APP_URL}/auth/new-password`;
    
    console.log("Password reset requested for:", email);
    console.log("Using redirect URL:", redirectTo);
    
    // Request password reset with proper redirectTo URL
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Password Reset Error",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    toast({
      title: "Password Reset",
      description: "Check your email for a password reset link.",
    });
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Password reset exception:", error);
    toast({
      title: "Password Reset Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: "An unexpected error occurred" };
  }
};

// Helper function to set up custom email template
async function setupCustomEmailTemplate() {
  try {
    console.log("Setting up custom email templates before sending reset email");
    // Make a more robust call with multiple retries
    for (let i = 0; i < 3; i++) {
      try {
        const { data, error } = await supabase.functions.invoke('custom-email', {
          method: 'POST',
          body: { action: 'setup-templates' }
        });
        
        if (error) {
          console.error(`Attempt ${i+1} - Error setting up custom email template:`, error);
        } else {
          console.log(`Attempt ${i+1} - Custom email template set up successfully:`, data);
          return; // Success, exit the function
        }
      } catch (err) {
        console.error(`Attempt ${i+1} - Exception setting up custom email template:`, err);
      }
      
      // Wait before retrying (exponential backoff)
      if (i < 2) { // Don't wait after the last attempt
        await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, i)));
      }
    }
    console.log("All attempts to set up email template completed");
  } catch (err) {
    console.error("Failed completely to set up custom email template:", err);
  }
}

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
