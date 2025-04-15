
import { supabase } from "@/integrations/supabase/client";
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
    
    const origin = window.location.origin;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple' as Provider,
      options: {
        redirectTo: `${origin}/auth/callback`
      }
    });
    
    if (error) {
      console.error("Apple sign-in error:", error);
      
      if (error.message.includes("provider is not enabled")) {
        toast({
          title: "Apple Sign In Not Available",
          description: "Apple sign-in is not currently enabled. Please use another sign-in method.",
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

    console.log("Apple sign-in initiated:", data);
    
    // Critical fix: Actually redirect to Apple's OAuth page
    if (data.url) {
      window.location.replace(data.url);
    } else {
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
