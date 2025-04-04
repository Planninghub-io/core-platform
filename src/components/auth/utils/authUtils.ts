
import { supabase } from "@/integrations/supabase/client";
import { SignUpData, handleUserSignUp } from "./signUpUtils";
import { SignInData, handleUserSignIn, handleGoogleSignIn, handleAppleSignIn } from "./signInUtils";
import { sendPasswordResetOTP, setNewPassword as otpSetNewPassword } from "./otpUtils";
import { setupMFA, verifyMFA } from "./mfaUtils";

export type { SignUpData, SignInData };

// Re-export the functions from their respective files
export { 
  handleUserSignUp,
  handleUserSignIn,
  handleGoogleSignIn,
  handleAppleSignIn,
  sendPasswordResetOTP,
  setupMFA,
  verifyMFA
};

// Set new password (using the implementation from otpUtils to avoid duplication)
export const setNewPassword = otpSetNewPassword;

// Check if user needs profile setup
export const checkProfileSetup = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.user_metadata?.needs_profile_setup === true;
};
