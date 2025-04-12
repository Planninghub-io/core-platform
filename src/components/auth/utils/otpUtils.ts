
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

// Function to setup custom email template with cache busting
const setupCustomEmailTemplate = async (): Promise<boolean> => {
  try {
    console.log("Setting up custom email template for password reset...");
    
    // Generate a unique timestamp for cache busting
    const timestamp = Date.now();
    
    // Call the custom-email edge function to set up the email template
    const { data, error } = await supabase.functions.invoke('custom-email', {
      method: 'POST',
      body: { 
        action: 'setup-templates',
        timestamp, // Add timestamp to prevent caching
        cacheBuster: `t=${timestamp}`
      }
    });
    
    if (error) {
      console.error("Error setting up email template:", error);
      return false;
    }
    
    console.log("Template setup response:", data);
    return data?.success === true;
  } catch (err) {
    console.error("Exception during template setup:", err);
    return false;
  }
};

// Function to send OTP for password reset
export const sendPasswordResetOTP = async (
  email: string,
  toast: any
) => {
  try {
    // First, ensure the custom email template is set up with a force refresh
    const templateSetupSuccess = await setupCustomEmailTemplate();
    
    if (!templateSetupSuccess) {
      console.warn("Custom template setup may have failed, continuing with default template");
    } else {
      console.log("Custom template setup successful");
    }
    
    // Short delay to ensure template is applied
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use the correct absolute URL for redirection
    const redirectTo = `${APP_URL}/auth/new-password`;
    
    console.log("Password reset requested for:", email);
    console.log("Using redirect URL:", redirectTo);
    
    // Add cache busting parameter to ensure we don't get a cached template
    const cacheBuster = Date.now();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${redirectTo}?cb=${cacheBuster}`,
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
