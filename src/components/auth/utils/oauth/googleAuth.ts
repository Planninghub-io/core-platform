
import { supabase, configureOAuthRedirect } from "@/integrations/supabase/client";
import type { SignInResult } from "../types/auth";

export const handleGoogleSignIn = async (toast: any): Promise<SignInResult> => {
  try {
    console.log("Attempting Google sign in");
    
    const { provider, options } = configureOAuthRedirect('google');
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options
    });

    if (error) {
      console.error("Google sign in error:", error);
      
      if (error.message.includes("Provider google is disabled")) {
        toast({
          title: "Google Sign-In Unavailable",
          description: "Google sign-in is currently disabled. Please use email and password.",
          variant: "destructive",
        });
        return { success: false, error: "Google sign-in disabled", providerDisabled: true };
      }
      
      toast({
        title: "Google Sign-In Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    // OAuth redirect is happening, so we return success
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Unexpected Google sign in error:", error);
    toast({
      title: "Google Sign-In Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: "An unexpected error occurred" };
  }
};
