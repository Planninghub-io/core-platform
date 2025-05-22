
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
    // Get Turnstile token if available
    let captchaToken = null;
    if (typeof window !== 'undefined' && window.turnstile) {
      try {
        // Get the token from the existing widget
        captchaToken = window.turnstile.getResponse();
        
        if (!captchaToken) {
          console.log("No token found from existing widget, forcing execution");
          
          try {
            // Try to execute the widget to get a token
            captchaToken = await window.turnstile.execute();
            console.log("Token obtained via execute:", captchaToken ? "Success" : "Failed");
          } catch (execError) {
            console.error("Error executing Turnstile:", execError);
          }
        }
        
        console.log("Turnstile token for signup:", captchaToken ? "Token received" : "No token");
      } catch (captchaError) {
        console.error("Turnstile error during signup:", captchaError);
      }
    } else {
      console.warn("Turnstile not available");
    }
    
    // Sign up with the Supabase client
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken,
        data: {
          account_type: isBusiness ? 'business' : 'individual',
          needs_profile_setup: true,
          email_verified: false
        },
      },
    });

    if (error) {
      if (error.message.includes("User already registered")) {
        toast({
          title: "Registration Error",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
      } else if (error.message.includes("captcha verification")) {
        toast({
          title: "CAPTCHA Verification Failed",
          description: "Please try again with CAPTCHA verification.",
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

    // Redirect to profile setup
    redirectCallback();
    return { success: true, error: null };
  } catch (error: any) {
    toast({
      title: "Registration Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};
