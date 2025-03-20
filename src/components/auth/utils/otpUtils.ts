
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

// Function to send OTP for password reset
export const sendPasswordResetOTP = async (
  email: string,
  toast: any
) => {
  try {
    // The problem might be with the redirectTo URL format - ensure it's properly redirecting to the new password form
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/new-password`,
      // Note: We can't customize the email subject directly here - this requires a Supabase Edge Function
    });

    if (error) {
      toast({
        title: "Password Reset Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Password Reset",
      description: "Check your email for a password reset link.",
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Password Reset Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Function to set new password after reset
export const setNewPassword = async (
  password: string,
  toast: any,
  redirectCallback: () => void
) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      toast({
        title: "Password Update Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Password Updated",
      description: "Your password has been successfully updated.",
    });
    
    redirectCallback();
    return true;
  } catch (error: any) {
    toast({
      title: "Password Update Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};
