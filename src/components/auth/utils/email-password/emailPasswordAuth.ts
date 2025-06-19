
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
    
    // Use the most basic sign-in request possible
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password
    });
    
    console.log("Sign in response:", { data, error });
    
    if (error) {
      console.error("Sign in error:", error);
      
      // Handle specific error cases
      if (error.message.includes("Invalid login credentials")) {
        toast({
          title: "Sign In Failed",
          description: "Incorrect email or password. Please try again.",
          variant: "destructive",
        });
        return { success: false, error: "Invalid credentials" };
      }
      
      if (error.message.includes("captcha") || 
          error.code === "captcha_verification_failed" ||
          error.message.includes("Authentication service temporarily unavailable")) {
        
        console.log("Captcha/service error detected, attempting alternative approach");
        
        // Wait a moment and try again with a clean session
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        try {
          // Clear any existing session first
          await supabase.auth.signOut();
          
          // Try again with fresh session
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password: password
          });
          
          if (retryError) {
            console.error("Retry also failed:", retryError);
            toast({
              title: "Authentication Issue",
              description: "Unable to sign in at the moment. Please try again in a few minutes.",
              variant: "destructive",
            });
            return { success: false, error: "Service temporarily unavailable" };
          }
          
          if (retryData.session) {
            console.log("Retry successful");
            redirectCallback();
            return { success: true, error: null };
          }
        } catch (retryErr) {
          console.error("Retry attempt failed:", retryErr);
        }
        
        toast({
          title: "Authentication Service Issue",
          description: "The authentication service is experiencing issues. Please try again shortly.",
          variant: "destructive",
        });
        return { success: false, error: "Service temporarily unavailable" };
      }
      
      // Handle other errors
      toast({
        title: "Sign In Error",
        description: error.message || "An error occurred during sign in",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    // Check for successful authentication
    if (data.session && data.user) {
      console.log("Sign in successful");
      
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
      
      redirectCallback();
      return { success: true, error: null };
    }

    // Handle case where session is missing but no error
    if (!data.session && data.user) {
      toast({
        title: "Verification Required",
        description: "Please check your email for a verification link.",
      });
      return { success: false, error: "Email verification required" };
    }

    // Fallback for unexpected cases
    toast({
      title: "Sign In Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: "Unexpected authentication state" };

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
