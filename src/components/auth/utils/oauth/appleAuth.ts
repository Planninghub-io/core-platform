
import { supabase, configureOAuthRedirect, PRODUCTION_URL } from "@/integrations/supabase/client";
import type { Provider } from "@supabase/supabase-js";
import type { SignInResult } from "../types/auth";

export const handleAppleSignIn = async (
  toast: any
): Promise<SignInResult> => {
  try {
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth') {
      localStorage.setItem('authRedirectPath', currentPath);
    } else {
      localStorage.setItem('authRedirectPath', '/');
    }
    
    console.log("Attempting to sign in with Apple...");
    
    // IMPORTANT: This uses the production URL (https://yourplanner.ai/auth/callback)
    // The redirect URL MUST match exactly in Supabase and Apple Developer settings
    const oauthConfig = configureOAuthRedirect('apple');
    console.log("Apple OAuth config:", oauthConfig);
    console.log("Redirect URL being used:", PRODUCTION_URL + "/auth/callback");
    
    const { data, error } = await supabase.auth.signInWithOAuth(oauthConfig);
    
    if (error) {
      console.error("Apple sign-in error:", error);
      
      if (error.message.includes("redirect_uri_mismatch")) {
        toast({
          title: "OAuth Configuration Error",
          description: "Redirect URL mismatch. Please check Apple Developer settings.",
          variant: "destructive",
        });
        console.error("The redirect URL in your code doesn't match the one authorized in Apple Developer settings");
        console.error("Expected redirect URL: " + PRODUCTION_URL + "/auth/callback");
        return { success: false, error: error.message, configError: true };
      }
      
      if (error.message.includes("provider is not enabled")) {
        toast({
          title: "Apple Sign In Not Available",
          description: "Apple sign-in is not currently enabled. Please check Supabase auth configuration.",
          variant: "destructive",
        });
        return { success: false, error: error.message, providerDisabled: true };
      } else {
        toast({
          title: "Apple Sign In Error",
          description: error.message,
          variant: "destructive",
        });
      }
      return { success: false, error: error.message };
    }

    console.log("Apple sign-in initiated successfully, redirecting to:", data?.url);
    
    // Critical fix: Actually redirect to Apple's OAuth page
    if (data.url) {
      console.log("Full redirect URL:", data.url);
      window.location.replace(data.url);
    } else {
      console.error("No redirect URL provided by Supabase");
      toast({
        title: "Configuration Error",
        description: "The authentication provider is not configured correctly.",
        variant: "destructive",
      });
      return { success: false, error: "Missing OAuth URL" };
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Apple sign-in exception:", error);
    toast({
      title: "Apple Sign In Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: "An unexpected error occurred" };
  }
};
