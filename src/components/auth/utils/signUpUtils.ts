
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
    // Get CAPTCHA token if hCaptcha is available
    let captchaToken = null;
    if (typeof window !== 'undefined' && window.hcaptcha) {
      try {
        // Render hCaptcha if not already rendered
        const captchaContainer = document.getElementById('h-captcha');
        if (!captchaContainer) {
          const container = document.createElement('div');
          container.id = 'h-captcha';
          container.style.display = 'none';
          document.body.appendChild(container);
          
          window.hcaptcha.render('h-captcha', {
            sitekey: '0x4AAAAAAAAjPBF8Abbp7OG3',  // Default hCaptcha site key for Supabase
            size: 'invisible'
          });
        }
        
        // Get the token
        captchaToken = await window.hcaptcha.execute();
        console.log("CAPTCHA token obtained for signup:", captchaToken ? "Token received" : "No token");
      } catch (captchaError) {
        console.error("CAPTCHA error during signup:", captchaError);
      }
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
