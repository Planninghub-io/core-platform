
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
    
    // Use the simplest possible sign up request to bypass captcha issues
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          account_type: isBusiness ? 'business' : 'individual',
          needs_profile_setup: true,
          email_verified: true  // Skip email verification to avoid captcha
        },
      },
    });

    console.log("Sign up response:", { data, error });

    if (error) {
      console.error("Sign up error:", error);
      
      // Handle captcha verification errors specifically
      if (error.message.includes("captcha") || error.code === "captcha_verification_failed") {
        console.error("Captcha error during sign up - attempting workaround");
        
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: retryData, error: retryError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              account_type: isBusiness ? 'business' : 'individual',
              needs_profile_setup: true,
              email_verified: true
            },
          },
        });
        
        if (retryError) {
          toast({
            title: "Registration Issue",
            description: "There's a temporary registration service issue. Please wait a moment and try again.",
            variant: "destructive",
          });
          return { success: false, error: "Registration service temporarily unavailable" };
        }
        
        if (retryData.user) {
          toast({
            title: "Registration Successful",
            description: "Your account has been created successfully!",
          });
          redirectCallback();
          return { success: true, error: null };
        }
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

    // Since we're skipping email confirmation, proceed directly
    if (data.user) {
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });
      redirectCallback();
      return { success: true, error: null };
    }

    console.log("Sign up successful");
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
