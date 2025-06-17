
import { supabase } from "@/integrations/supabase/client";
import type { SignInData, SignInResult } from "../types/auth";

export const handleUserSignIn = async (
  formData: SignInData,
  toast: any,
  redirectCallback: () => void
): Promise<SignInResult> => {
  const { email, password } = formData;
  if (!email || !password) {
    toast({
      title: "Error",
      description: "Please enter both email and password",
      variant: "destructive",
    });
    return { success: false, error: "Please enter both email and password" };
  }
  
  try {
    console.log("Attempting sign in with email:", email);
    
    // Clean sign in request with minimal parameters
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });
    
    console.log("Sign in response:", { data, error });
    
    if (error) {
      console.error("Sign in error:", error);
      
      // Handle specific error cases with more detailed logging
      if (error.message.includes("captcha") || error.message.includes("verification")) {
        console.error("Captcha/verification error details:", {
          message: error.message,
          status: error.status,
          details: error
        });
        toast({
          title: "Sign In Error",
          description: "There's a temporary authentication issue. Please try again in a moment.",
          variant: "destructive",
        });
        return { success: false, error: "Authentication service temporarily unavailable" };
      }
      
      if (error.message.includes("Invalid login credentials")) {
        toast({
          title: "Sign In Failed",
          description: "Incorrect email or password. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign In Error",
          description: error.message,
          variant: "destructive",
        });
      }
      return { success: false, error: error.message };
    }

    if (data.session === null && data.user) {
      toast({
        title: "Verification Required",
        description: "A verification code has been sent to your email.",
      });
      
      return { success: false, error: "Verification required" };
    }

    // Check for MFA requirements
    try {
      const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      
      if (!mfaError && mfaData.currentLevel === 'aal1' && mfaData.nextLevel === 'aal2') {
        localStorage.setItem('authRedirectPath', '/auth/mfa-challenge');
        redirectCallback();
        return { success: false, error: "MFA challenge required" };
      }
    } catch (mfaCheckError) {
      console.log("MFA check failed, continuing without MFA:", mfaCheckError);
    }

    console.log("Sign in successful");
    redirectCallback();
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Unexpected sign in error:", error);
    toast({
      title: "Sign In Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: "An unexpected error occurred" };
  }
};
