
import { supabase, configureOAuthRedirect, PRODUCTION_URL, APP_URL } from "@/integrations/supabase/client";
import type { SignInResult } from "../types/auth";

export const handleGoogleSignIn = async (
  toast: any
): Promise<SignInResult> => {
  try {
    console.log("Starting Google sign-in process");
    
    // Save current path for redirecting back after authentication
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth') {
      localStorage.setItem('authRedirectPath', currentPath);
    } else {
      localStorage.setItem('authRedirectPath', '/');
    }
    
    // Get OAuth configuration using the APP_URL instead of production URL
    // This ensures proper redirection based on environment
    const redirectTo = `${APP_URL}/auth/callback`;
    console.log("Google OAuth redirect URL:", redirectTo);
    
    const oauthConfig = {
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline'
        }
      }
    };
    
    console.log("Google OAuth config:", oauthConfig);
    
    // Clear any existing query parameters from local storage to prevent conflicts
    localStorage.removeItem('supabase.auth.callback_params');
    
    // Initiate the OAuth sign-in process
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
        console.error("Expected redirect URL: " + redirectTo);
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
