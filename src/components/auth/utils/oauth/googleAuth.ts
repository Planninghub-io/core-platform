
import { supabase, configureOAuthRedirect } from "@/integrations/supabase/client";
import type { SignInResult } from "../types/auth";

export const handleGoogleSignIn = async (toast: any): Promise<SignInResult> => {
  try {
    console.log("Attempting Google sign in");
    
    // Store redirect path for after authentication
    localStorage.setItem('authRedirectPath', window.location.pathname);
    
    const { provider, options } = configureOAuthRedirect('google');
    
    console.log("Google OAuth config:", { provider, redirectTo: options.redirectTo });
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        ...options,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        }
      }
    });

    if (error) {
      console.error("Google sign in error:", error);
      
      // Handle specific error cases
      if (error.message.includes("Provider google is disabled")) {
        toast({
          title: "Google Sign-In Unavailable",
          description: "Google sign-in is currently disabled. Please use email and password or contact support.",
          variant: "destructive",
        });
        return { success: false, error: "Google sign-in disabled", providerDisabled: true };
      }
      
      if (error.message.includes("Invalid login credentials")) {
        toast({
          title: "Authentication Error",
          description: "Unable to authenticate with Google. Please try again or use email/password.",
          variant: "destructive",
        });
        return { success: false, error: "Invalid credentials" };
      }
      
      if (error.message.includes("redirect_uri")) {
        toast({
          title: "Configuration Error",
          description: "Google authentication is not properly configured. Please contact support.",
          variant: "destructive",
        });
        return { success: false, error: "Configuration error" };
      }
      
      toast({
        title: "Google Sign-In Error",
        description: error.message || "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    console.log("Google OAuth redirect initiated successfully");
    // OAuth redirect is happening, so we return success
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Unexpected Google sign in error:", error);
    toast({
      title: "Google Sign-In Error",
      description: "An unexpected error occurred. Please try again or use email/password.",
      variant: "destructive",
    });
    return { success: false, error: "An unexpected error occurred" };
  }
};
