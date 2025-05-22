
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
    // Get Turnstile token if available
    let captchaToken = null;
    if (typeof window !== 'undefined' && window.turnstile) {
      try {
        // Get the token from the existing widget
        captchaToken = window.turnstile.getResponse();
        
        if (!captchaToken) {
          console.log("No token found from existing widget, forcing execution");
          
          try {
            // Try to execute the widget to get a token
            captchaToken = await window.turnstile.execute();
            console.log("Token obtained via execute:", captchaToken ? "Success" : "Failed");
          } catch (execError) {
            console.error("Error executing Turnstile:", execError);
          }
        }
        
        console.log("Turnstile token for signin:", captchaToken ? "Token received" : "No token");
      } catch (captchaError) {
        console.error("Turnstile error during signin:", captchaError);
      }
    } else {
      console.warn("Turnstile not available");
    }
    
    // Include the captcha token in the auth request
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: captchaToken ? {
        captchaToken
      } : undefined
    });
    
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast({
          title: "Sign In Failed",
          description: "Incorrect email or password. Please try again.",
          variant: "destructive",
        });
      } else if (error.message.includes("captcha verification")) {
        toast({
          title: "CAPTCHA Verification Failed",
          description: "Please try again with CAPTCHA verification.",
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
