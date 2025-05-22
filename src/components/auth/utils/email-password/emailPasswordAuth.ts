
import { supabase } from "@/integrations/supabase/client";
import type { SignInData, SignInResult } from "../types/auth";

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
  
  // Load the hCaptcha script if it hasn't been loaded yet
  if (typeof window !== 'undefined' && !window.hcaptcha) {
    try {
      // Create and load the hCaptcha script
      const script = document.createElement('script');
      script.src = 'https://js.hcaptcha.com/1/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      // Wait for the script to load
      await new Promise((resolve) => {
        script.onload = resolve;
      });
      
      console.log("hCaptcha script loaded successfully");
    } catch (error) {
      console.error("Failed to load hCaptcha script:", error);
    }
  }
  
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
        console.log("CAPTCHA token obtained:", captchaToken ? "Token received" : "No token");
      } catch (captchaError) {
        console.error("CAPTCHA error:", captchaError);
      }
    } else {
      console.warn("hCaptcha not available, proceeding without CAPTCHA");
    }
    
    // Include the captcha token in the auth request
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: captchaToken ? {
        captchaToken
      } : undefined
    });
    
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast({
          title: "Sign In Failed",
          description: "Incorrect email or password. Please try again.",
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
