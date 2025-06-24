
import { supabase, configureOAuthRedirect } from "@/integrations/supabase/client";
import type { SignInResult } from "../types/auth";

export const handleAppleSignIn = async (toast: any): Promise<SignInResult> => {
  try {
    console.log("Attempting Apple sign in");
    
    const { provider, options } = configureOAuthRedirect('apple');
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options
    });

    if (error) {
      console.error("Apple sign in error:", error);
      
      if (error.message.includes("Provider apple is disabled")) {
        toast({
          title: "Apple Sign-In Unavailable",
          description: "Apple sign-in is currently disabled. Please use email and password.",
          variant: "destructive",
        });
        return { success: false, error: "Apple sign-in disabled", providerDisabled: true };
      }
      
      toast({
        title: "Apple Sign-In Error",
        description: error.message || "Failed to sign in with Apple",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    // OAuth redirect is happening, so we return success
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Unexpected Apple sign in error:", error);
    toast({
      title: "Apple Sign-In Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: "An unexpected error occurred" };
  }
};
