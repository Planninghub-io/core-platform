
import { Provider } from "@supabase/supabase-js";
import { supabase, APP_URL, configureOAuthRedirect } from "@/integrations/supabase/client";

export interface SignInData {
  email: string;
  password: string;
}

export interface SignInResult {
  success: boolean;
  error: string | null;
  providerDisabled?: boolean;
}

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

export const handleGoogleSignIn = async (
  toast: any
): Promise<SignInResult> => {
  try {
    console.log("Starting Google sign-in process");
    
    // Store the current path for redirecting after authentication
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth') {
      localStorage.setItem('authRedirectPath', currentPath);
    } else {
      localStorage.setItem('authRedirectPath', '/');
    }
    
    // Use the correct Provider type for Google and simplify the configuration
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google' as Provider,
      options: {
        redirectTo: window.location.origin + '/auth/callback',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });
    
    if (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Google Sign In Error",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
    
    console.log("Google sign-in initiated successfully");
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
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple' as Provider,
      options: {
        redirectTo: window.location.origin + '/auth/callback'
      }
    });
    
    if (error) {
      console.error("Apple sign-in error:", error);
      
      // Check if the error is related to disabled provider
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
