
import { supabase, PRODUCTION_URL } from "@/integrations/supabase/client";

// Main function to send OTP for password reset
export const sendPasswordResetOTP = async (
  email: string,
  toast: any
) => {
  try {
    console.log("Password reset flow started for:", email);
    
    // First, ensure the custom email template is set up
    const templateSetupSuccess = await setupCustomEmailTemplate();
    logTemplateSetupResult(templateSetupSuccess);
    
    // Always use PRODUCTION_URL for password reset redirects
    const redirectTo = generateRedirectUrl();
    logRedirectInfo(email, redirectTo);
    
    // Send the password reset email with cache busting
    const result = await sendPasswordResetEmail(email, redirectTo);
    
    if (result.error) {
      handlePasswordResetError(result.error, toast);
      return { success: false, error: result.error.message };
    }
    
    console.log("Password reset email sent successfully");
    return { success: true, error: null };
  } catch (error: any) {
    handleUnexpectedError(error, toast);
    return { success: false, error: "An unexpected error occurred" };
  }
};

// Generate the redirect URL with cache busting parameter
const generateRedirectUrl = () => {
  const baseRedirectUrl = `${PRODUCTION_URL}/auth/new-password`;
  const cacheBuster = Date.now();
  return `${baseRedirectUrl}?cb=${cacheBuster}`;
};

// Log information about the redirect URL
const logRedirectInfo = (email: string, redirectTo: string) => {
  console.log("Password reset requested for:", email);
  console.log("Using redirect URL:", redirectTo);
  console.log("Using PRODUCTION_URL for redirect:", PRODUCTION_URL);
};

// Send the actual password reset email
const sendPasswordResetEmail = async (email: string, redirectTo: string) => {
  const cacheBuster = Date.now();
  console.log("Sending password reset email with cache buster:", cacheBuster);
  
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${redirectTo}`,
  });
};

// Handle errors from the password reset process
const handlePasswordResetError = (error: any, toast: any) => {
  console.error("Password reset error:", error);
  toast({
    title: "Password Reset Error",
    description: error.message,
    variant: "destructive",
  });
};

// Handle unexpected errors during the process
const handleUnexpectedError = (error: any, toast: any) => {
  console.error("Password reset exception:", error);
  toast({
    title: "Password Reset Error",
    description: "An unexpected error occurred. Please try again.",
    variant: "destructive",
  });
};

// Log the result of template setup
const logTemplateSetupResult = (success: boolean) => {
  if (!success) {
    console.warn("Custom template setup may have failed, continuing with default template");
  } else {
    console.log("Custom template setup successful");
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
      success = await attemptTemplateSetup(attempt, maxRetries, timestamp);
      attempt++;
      
      // Wait before next attempt if not successful and not the last attempt
      if (!success && attempt < maxRetries) {
        await wait(1000);
      }
    }
    
    // Return status after all attempts
    return success;
  } catch (err) {
    console.error("Exception during template setup:", err);
    return false;
  }
};

// Attempt to set up the template (single attempt)
const attemptTemplateSetup = async (
  attempt: number, 
  maxRetries: number, 
  timestamp: number
): Promise<boolean> => {
  console.log(`Custom email template setup attempt ${attempt + 1} of ${maxRetries}...`);
  
  try {
    // Call the custom-email edge function to set up the email template
    console.log("Invoking custom-email edge function...");
    const { data, error } = await supabase.functions.invoke('custom-email', {
      method: 'POST',
      body: { 
        action: 'setup-templates',
        timestamp, 
        cacheBuster: `t=${timestamp}`
      }
    });
    
    if (error) {
      console.error(`Template setup attempt ${attempt + 1} failed:`, error);
      return false;
    }
    
    console.log(`Template setup response (attempt ${attempt + 1}):`, data);
    const success = data?.success === true;
    
    if (success) {
      console.log("Template setup successful on attempt", attempt + 1);
    } else {
      console.warn(`Template setup returned false on attempt ${attempt + 1}`);
    }
    
    return success;
  } catch (err) {
    console.error(`Template setup exception on attempt ${attempt + 1}:`, err);
    return false;
  }
};

// Helper function to wait a specific time
const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
