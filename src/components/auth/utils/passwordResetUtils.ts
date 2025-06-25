
import { supabase, PRODUCTION_URL } from "@/integrations/supabase/client";

// Main function to send OTP for password reset
export const sendPasswordResetOTP = async (
  email: string,
  toast: any
) => {
  try {
    console.log("Password reset flow started for:", email);
    
    // Use PRODUCTION_URL for password reset redirects
    const redirectTo = `${PRODUCTION_URL}/auth/new-password`;
    console.log("Using redirect URL:", redirectTo);
    
    // Use our custom email function directly since standard Supabase reset is failing
    console.log("Using custom email function");
    
    const response = await supabase.functions.invoke('send-password-reset', {
      body: { 
        email,
        resetUrl: redirectTo
      }
    });
    
    console.log("Edge function response:", response);
    
    if (response.error) {
      console.error("Custom email function error:", response.error);
      toast({
        title: "Password Reset Error",
        description: "Unable to send password reset email. Please try again later or contact support.",
        variant: "destructive",
      });
      return { success: false, error: response.error.message || "Email sending failed" };
    }
    
    // Check if the response data indicates success
    if (response.data && response.data.success) {
      console.log("Password reset email sent successfully");
      toast({
        title: "Reset Email Sent",
        description: "A password reset link has been sent to your email. Please check your inbox and click the link to reset your password.",
      });
      return { success: true, error: null };
    } else {
      console.error("Unexpected response from email function:", response.data);
      toast({
        title: "Password Reset Error",
        description: "Unable to send password reset email. Please try again later.",
        variant: "destructive",
      });
      return { success: false, error: "Unexpected response from email service" };
    }
    
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
