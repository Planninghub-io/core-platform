
import { supabase, configureOAuthRedirect } from "@/integrations/supabase/client";
import type { SignInResult } from "../types/auth";

export const handleGoogleSignIn = async (
  toast: any
): Promise<SignInResult> => {
  try {
    console.log("Starting Google sign-in process");
    
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth') {
      localStorage.setItem('authRedirectPath', currentPath);
    } else {
      localStorage.setItem('authRedirectPath', '/');
    }
    
    // Use the configureOAuthRedirect helper to get consistent OAuth configuration
    // This now always uses the production URL for the redirect
    const oauthConfig = configureOAuthRedirect('google');
    console.log("Google OAuth config:", oauthConfig);
    
    const { data, error } = await supabase.auth.signInWithOAuth(oauthConfig);
    
    if (error) {
      console.error("Google sign-in error:", error);
      
      // Check for common OAuth errors
      if (error.message.includes("redirect_uri_mismatch")) {
        toast({
          title: "OAuth Configuration Error",
          description: "Redirect URL mismatch. Please check Google Cloud Console settings.",
          variant: "destructive",
        });
        console.error("The redirect URL in your code doesn't match the one authorized in Google Cloud Console");
        return { success: false, error: error.message, configError: true };
      }
      
      if (error.message.includes("not enabled")) {
        toast({
          title: "Google Sign In Not Available",
          description: "Google sign-in is not currently configured properly. Please check Supabase auth configuration.",
          variant: "destructive",
        });
        return { success: false, error: error.message, providerDisabled: true };
      }
      
      toast({
        title: "Google Sign In Error",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
    
    console.log("Google sign-in initiated successfully, redirecting to:", data?.url);
    
    // Ensure we have a URL to redirect to
    if (data.url) {
      console.log("Full redirect URL:", data.url);
      
      // Use replace instead of href to completely reload the page
      // and avoid any potential state issues
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
    console.error("Google sign-in exception:", error);
    toast({
      title: "Google Sign In Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: "An unexpected error occurred" };
  }
};
