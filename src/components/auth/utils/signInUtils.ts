
import { supabase, APP_URL } from "@/integrations/supabase/client";

export interface SignInData {
  email: string;
  password: string;
}

export interface SignInResult {
  success: boolean;
  error: string | null;
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

    // Check if MFA is enabled for the user
    const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    
    if (!mfaError && mfaData.currentLevel === 'aal1' && mfaData.nextLevel === 'aal2') {
      // User has MFA enabled but needs to complete the second factor
      // We need to use the redirectCallback instead of direct navigation here
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
  toast: any,
  redirectCallback?: () => void
): Promise<SignInResult> => {
  try {
    const redirectUrl = `${APP_URL}/auth/callback`;
    console.log("Google sign-in with redirect URL:", redirectUrl);
    
    const currentPath = localStorage.getItem('authRedirectPath') || '/';
    if (!currentPath || currentPath === '/auth') {
      localStorage.setItem('authRedirectPath', '/');
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
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

    console.log("Google sign-in initiated:", data);
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
  toast: any,
  redirectCallback?: () => void
): Promise<SignInResult> => {
  try {
    const redirectUrl = `${APP_URL}/auth/callback`;
    console.log("Apple sign-in with redirect URL:", redirectUrl);
    
    const currentPath = localStorage.getItem('authRedirectPath') || '/';
    if (!currentPath || currentPath === '/auth') {
      localStorage.setItem('authRedirectPath', '/');
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: redirectUrl,
        scopes: 'name email'
      }
    });
    
    if (error) {
      console.error("Apple sign-in error:", error);
      toast({
        title: "Apple Sign In Error",
        description: error.message,
        variant: "destructive",
      });
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
