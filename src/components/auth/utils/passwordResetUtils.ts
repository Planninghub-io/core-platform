
import { supabase, PRODUCTION_URL } from "@/integrations/supabase/client";

// Main function to send OTP for password reset
export const sendPasswordResetOTP = async (
  email: string,
  toast: any
) => {
  try {
    console.log("Password reset flow started for:", email);
    
    // ALWAYS use PRODUCTION_URL for password reset redirects
    // This fixes the incorrect redirect to Lovable development environment
    const redirectTo = `${PRODUCTION_URL}/auth/new-password`;
    console.log("Using redirect URL:", redirectTo);
    
    // Send the password reset email
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo
    });
    
    if (result.error) {
      console.error("Password reset error:", result.error);
      toast({
        title: "Password Reset Error",
        description: result.error.message,
        variant: "destructive",
      });
      return { success: false, error: result.error.message };
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
