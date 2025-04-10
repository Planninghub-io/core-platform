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
    await setupCustomEmailTemplateWithRetry();
    
    // Use the environment-aware APP_URL
    const redirectTo = `${APP_URL}/auth/new-password`;
    
    console.log("Password reset requested for:", email);
    console.log("Using redirect URL:", redirectTo);
    
    // Add a small delay to ensure template has been applied
    await new Promise(resolve => setTimeout(resolve, 500));
    
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

// Helper function to set up custom email template with multiple retries
async function setupCustomEmailTemplateWithRetry(maxRetries = 3) {
  console.log("Starting template setup with retries:", maxRetries);
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Template setup attempt ${attempt}/${maxRetries}`);
      
      const { data, error } = await supabase.functions.invoke('custom-email', {
        method: 'POST',
        body: { 
          action: 'setup-templates',
          timestamp: new Date().toISOString() // Add timestamp to prevent caching
        }
      });
      
      if (error) {
        console.error(`Attempt ${attempt} - Error setting up template:`, error);
        lastError = error;
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delay = 500 * Math.pow(2, attempt - 1);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } else {
        console.log(`Template setup successful on attempt ${attempt}:`, data);
        return true; // Success
      }
    } catch (err) {
      console.error(`Attempt ${attempt} - Exception during template setup:`, err);
      lastError = err;
      
      // Wait before retrying
      if (attempt < maxRetries) {
        const delay = 500 * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.warn("All template setup attempts failed, last error:", lastError);
  return false; // All attempts failed
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
