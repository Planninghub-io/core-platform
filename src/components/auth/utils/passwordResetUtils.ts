
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
    
    // Try the standard Supabase reset first
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo
    });
    
    if (result.error) {
      console.error("Supabase password reset error:", result.error);
      
      // If Supabase email fails, try using our custom email function
      if (result.error.message.includes("Error sending recovery email") || 
          result.error.message.includes("Invalid username")) {
        console.log("Falling back to custom email function");
        
        try {
          const response = await supabase.functions.invoke('send-password-reset', {
            body: { 
              email,
              resetUrl: redirectTo
            }
          });
          
          if (response.error) {
            console.error("Custom email function error:", response.error);
            throw response.error;
          }
          
          console.log("Custom password reset email sent successfully");
          toast({
            title: "Reset Email Sent",
            description: "A password reset link has been sent to your email. Please check your inbox and click the link to reset your password.",
          });
          return { success: true, error: null };
        } catch (customError: any) {
          console.error("Custom email function failed:", customError);
          toast({
            title: "Password Reset Error",
            description: "Unable to send password reset email. Please try again later or contact support.",
            variant: "destructive",
          });
          return { success: false, error: "Email sending failed" };
        }
      }
      
      toast({
        title: "Password Reset Error",
        description: result.error.message,
        variant: "destructive",
      });
      return { success: false, error: result.error.message };
    }
    
    console.log("Standard password reset email sent successfully");
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
