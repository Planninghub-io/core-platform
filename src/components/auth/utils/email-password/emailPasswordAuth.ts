
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
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

    const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    
    if (!mfaError && mfaData.currentLevel === 'aal1' && mfaData.nextLevel === 'aal2') {
      localStorage.setItem('authRedirectPath', '/auth/mfa-challenge');
      redirectCallback();
      return { success: false, error: "MFA challenge required" };
    }

    redirectCallback();
    return { success: true, error: null };
  } catch (error: any) {
    toast({
      title: "Sign In Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: "An unexpected error occurred" };
  }
};
