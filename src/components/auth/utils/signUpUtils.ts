
import { supabase, APP_URL } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export interface SignUpData {
  email: string;
  password: string;
  role?: string;
}

export const handleUserSignUp = async (
  formData: SignUpData,
  isBusiness: boolean,
  toast: any,
  redirectCallback: () => void
) => {
  const { email, password, role } = formData;

  if (password.length < 6) {
    toast({
      title: "Error",
      description: "Password must be at least 6 characters long",
      variant: "destructive",
    });
    return false;
  }

  try {
    // Important: set emailRedirectTo to null to prevent auto sign-in after signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: null, // Prevent default redirect
        data: {
          role: role || (isBusiness ? 'business_admin' : 'user'),
          is_business: isBusiness,
          needs_profile_setup: true, // Mark user as needing profile setup
          email_verified: false // Explicitly mark as not verified
        }
      }
    });

    if (authError) {
      if (authError.message === "User already registered") {
        toast({
          title: "Account Exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
      } else {
        throw authError;
      }
      return false;
    }

    // Send welcome email with verification code
    try {
      await supabase.functions.invoke('welcome-email', {
        body: { email, isBusiness }
      });
      
      console.log("Verification email sent to:", email);
      
      toast({
        title: "Account Created!",
        description: "Please check your email for a verification code.",
      });
      
      // Navigate to email verification page with email parameter
      // Important: We're manually redirecting instead of using the redirectCallback
      window.location.href = "/auth/email-verification?email=" + encodeURIComponent(email);
      return true;
    } catch (emailError) {
      console.error("Welcome email could not be sent:", emailError);
      toast({
        title: "Warning",
        description: "Account created, but verification email could not be sent. Please contact support.",
        variant: "destructive",
      });
      return false;
    }
  } catch (error: any) {
    toast({
      title: "Sign Up Error",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};
