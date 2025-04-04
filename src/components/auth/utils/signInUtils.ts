
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
  toast: any
): Promise<SignInResult> => {
  try {
    console.log("Starting Google sign-in process");
    
    // Store current path before redirect
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth') {
      localStorage.setItem('authRedirectPath', currentPath);
    } else {
      localStorage.setItem('authRedirectPath', '/');
    }
    
    // Instead of using the Supabase SDK for Google sign-in, we'll construct the URL manually
    // and perform a direct browser redirect to avoid iframe issues
    const provider = 'google';
    const redirectTo = encodeURIComponent(`${APP_URL}/auth/callback`);
    
    // Generate a random code verifier for PKCE
    const generateCodeVerifier = () => {
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      return btoa(String.fromCharCode.apply(null, [...array]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    };
    
    const codeVerifier = generateCodeVerifier();
    
    // Store the code verifier in localStorage to use it during callback
    localStorage.setItem('pkce_code_verifier', codeVerifier);
    
    // Create authorization URL with all required parameters
    // Fix: Don't use supabase.auth.baseUrl which doesn't exist
    const supabaseAuthUrl = `${SUPABASE_URL}/auth/v1`;
    const authUrl = `${supabaseAuthUrl}/authorize?provider=${provider}&redirect_to=${redirectTo}&code_challenge=${encodeURIComponent(codeVerifier)}&code_challenge_method=plain&access_type=offline&prompt=consent%20select_account`;
    
    console.log("Redirecting to:", authUrl);
    
    // Perform a full page redirect
    window.location.href = authUrl;
    
    // We won't reach this point due to the redirect
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
    // Store current path before redirect if not already on auth page
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth') {
      localStorage.setItem('authRedirectPath', currentPath);
    } else {
      localStorage.setItem('authRedirectPath', '/');
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${APP_URL}/auth/callback`,
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
