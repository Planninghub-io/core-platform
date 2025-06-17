
import { supabase } from "@/integrations/supabase/client";

export interface SignUpData {
  email: string;
  password: string;
}

export const handleUserSignUp = async (
  formData: SignUpData,
  isBusiness: boolean,
  toast: any,
  redirectCallback: () => void
) => {
  const { email, password } = formData;

  try {
    console.log("Attempting sign up with email:", email);
    
    // Get the current origin for redirect URL
    const redirectUrl = `${window.location.origin}/`;
    
    // Clean sign up request with minimal parameters
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          account_type: isBusiness ? 'business' : 'individual',
          needs_profile_setup: true,
          email_verified: false
        },
      },
    });

    console.log("Sign up response:", { data, error });

    if (error) {
      console.error("Sign up error:", error);
      
      // Handle specific error cases with detailed logging
      if (error.message.includes("captcha") || error.message.includes("verification")) {
        console.error("Captcha/verification error details:", {
          message: error.message,
          status: error.status,
          details: error
        });
        toast({
          title: "Registration Error",
          description: "There's a temporary registration issue. Please try again in a moment.",
          variant: "destructive",
        });
        return { success: false, error: "Registration service temporarily unavailable" };
      }
      
      if (error.message.includes("User already registered")) {
        toast({
          title: "Registration Error",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Error",
          description: error.message,
          variant: "destructive",
        });
      }
      return { success: false, error: error.message };
    }

    // Check if email confirmation is required
    if (data.session === null) {
      toast({
        title: "Verification Email Sent",
        description: "Please check your email for a verification link.",
      });
      
      // Redirect to email verification page
      if (data.user?.email) {
        window.location.href = `/auth/email-verification?email=${encodeURIComponent(data.user.email)}`;
      }
      
      return { success: true, error: null };
    }

    console.log("Sign up successful");
    // Redirect to profile setup
    redirectCallback();
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Unexpected sign up error:", error);
    toast({
      title: "Registration Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};
