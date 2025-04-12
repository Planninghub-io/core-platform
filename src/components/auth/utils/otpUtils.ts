
import { supabase } from "@/integrations/supabase/client";

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

// Function to setup custom email template with multiple retries
const setupCustomEmailTemplate = async (): Promise<boolean> => {
  try {
    console.log("Setting up custom email template for password reset...");
    
    // Generate a unique timestamp for cache busting
    const timestamp = Date.now();
    
    // Maximum number of retry attempts
    const maxRetries = 3;
    let attempt = 0;
    let success = false;
    
    // Try multiple times if needed
    while (attempt < maxRetries && !success) {
      attempt++;
      console.log(`Custom email template setup attempt ${attempt} of ${maxRetries}...`);
      
      try {
        // Call the custom-email edge function to set up the email template
        console.log("Invoking custom-email edge function...");
        const { data, error } = await supabase.functions.invoke('custom-email', {
          method: 'POST',
          body: { 
            action: 'setup-templates',
            timestamp, // Add timestamp to prevent caching
            cacheBuster: `t=${timestamp}`
          }
        });
        
        if (error) {
          console.error(`Template setup attempt ${attempt} failed:`, error);
          // Wait before next attempt
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          continue;
        }
        
        console.log(`Template setup response (attempt ${attempt}):`, data);
        success = data?.success === true;
        
        if (success) {
          console.log("Template setup successful on attempt", attempt);
          return true;
        } else {
          console.warn(`Template setup returned false on attempt ${attempt}`);
        }
      } catch (err) {
        console.error(`Template setup exception on attempt ${attempt}:`, err);
      }
      
      // Wait before next attempt
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Return status after all attempts
    return success;
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
    console.log("Password reset flow started for:", email);
    
    // First, ensure the custom email template is set up with a force refresh
    console.log("Setting up custom email template...");
    const templateSetupSuccess = await setupCustomEmailTemplate();
    
    if (!templateSetupSuccess) {
      console.warn("Custom template setup may have failed, continuing with default template");
    } else {
      console.log("Custom template setup successful");
    }
    
    // Get the actual production URL for redirection
    const hostname = window.location.hostname;
    let baseUrl;
    
    if (hostname === 'yourplanner.ai' || hostname === 'www.yourplanner.ai') {
      baseUrl = 'https://www.yourplanner.ai';
    } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
      baseUrl = `${window.location.protocol}//${hostname}:${window.location.port}`;
    } else {
      baseUrl = window.location.origin;
    }
    
    // Use the correct absolute URL for redirection
    const redirectTo = `${baseUrl}/auth/new-password`;
    
    console.log("Password reset requested for:", email);
    console.log("Using redirect URL:", redirectTo);
    
    // Add cache busting parameter to ensure we don't get a cached template
    const cacheBuster = Date.now();
    console.log("Sending password reset email with cache buster:", cacheBuster);
    
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
    
    console.log("Password reset email sent successfully");
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
