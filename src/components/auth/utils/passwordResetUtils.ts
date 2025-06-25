
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
    
    // Try the custom email function first
    console.log("Attempting custom email function");
    
    try {
      const response = await supabase.functions.invoke('send-password-reset', {
        body: { 
          email,
          resetUrl: redirectTo
        }
      });
      
      console.log("Edge function response:", response);
      
      if (!response.error && response.data && response.data.success) {
        console.log("Password reset email sent successfully via custom function");
        toast({
          title: "Reset Email Sent",
          description: "A password reset link has been sent to your email. Please check your inbox and click the link to reset your password.",
        });
        return { success: true, error: null };
      }
      
      // If custom function fails, try standard Supabase reset
      console.log("Custom function failed, trying standard Supabase reset");
      
    } catch (edgeFunctionError) {
      console.error("Edge function error:", edgeFunctionError);
      console.log("Falling back to standard Supabase reset");
    }
    
    // Fallback to standard Supabase password reset
    console.log("Using standard Supabase password reset");
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo
    });
    
    if (error) {
      console.error("Standard Supabase reset error:", error);
      toast({
        title: "Password Reset Error",
        description: "Unable to send password reset email. Please try again later or contact support.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
    
    console.log("Standard Supabase reset successful");
    toast({
      title: "Reset Email Sent",
      description: "A password reset link has been sent to your email. Please check your inbox and click the link to reset your password.",
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
