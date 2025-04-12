
import { supabase } from "@/integrations/supabase/client";
import { SignUpData, handleUserSignUp } from "./signUpUtils";
import { SignInData, handleUserSignIn, handleGoogleSignIn, handleAppleSignIn, SignInResult } from "./signInUtils";
import { sendPasswordResetOTP } from "./passwordResetUtils";
import { setNewPassword } from "./passwordUpdateUtils";
import { setupMFA, verifyMFA } from "./mfaUtils";

export type { SignUpData, SignInData, SignInResult };

// Re-export the functions from their respective files
export { 
  handleUserSignUp,
  handleUserSignIn,
  handleGoogleSignIn,
  handleAppleSignIn,
  sendPasswordResetOTP,
  setupMFA,
  verifyMFA,
  setNewPassword
};

// Check if user needs profile setup
export const checkProfileSetup = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.user_metadata?.needs_profile_setup === true;
};
