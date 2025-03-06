
import { supabase } from "@/integrations/supabase/client";

export interface SignInData {
  email: string;
  password: string;
}

export const handleUserSignIn = async (
  formData: SignInData,
  toast: any,
  redirectCallback: () => void
) => {
  const { email, password } = formData;
  if (!email || !password) {
    toast({
      title: "Error",
      description: "Please enter both email and password",
      variant: "destructive",
    });
    return false;
  }
  
  try {
    // First, try to sign in with password
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
      return false;
    }

    // Check if MFA is required
    if (data.session === null && data.user) {
      // MFA is required, handle accordingly
      toast({
        title: "Verification Required",
        description: "A verification code has been sent to your email.",
      });
      
      // Wait for OTP entry or handle differently based on your UI
      return false;
    }

    redirectCallback();
    return true;
  } catch (error: any) {
    toast({
      title: "Sign In Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

export const handleGoogleSignIn = async (
  isBusiness: boolean,
  toast: any,
  redirectCallback: () => void
) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) {
      toast({
        title: "Google Sign In Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    // No need for redirect callback here as OAuth will handle the redirect
    return true;
  } catch (error: any) {
    toast({
      title: "Google Sign In Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};
