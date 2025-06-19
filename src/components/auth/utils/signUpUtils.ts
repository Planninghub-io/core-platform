
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
    
    // Use the most basic sign up request possible
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          account_type: isBusiness ? 'business' : 'individual',
          needs_profile_setup: true
        },
      },
    });

    console.log("Sign up response:", { data, error });

    if (error) {
      console.error("Sign up error:", error);
      
      // Handle specific error cases
      if (error.message.includes("User already registered")) {
        toast({
          title: "Account Already Exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
        return { success: false, error: "User already exists" };
      }
      
      if (error.message.includes("captcha") || 
          error.code === "captcha_verification_failed" ||
          error.message.includes("Authentication service temporarily unavailable")) {
        
        console.log("Captcha/service error detected during sign up");
        
        // Wait and try again
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        try {
          const { data: retryData, error: retryError } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password: password,
            options: {
              emailRedirectTo: redirectUrl,
              data: {
                account_type: isBusiness ? 'business' : 'individual',
                needs_profile_setup: true
              },
            },
          });
          
          if (retryError) {
            console.error("Sign up retry failed:", retryError);
            toast({
              title: "Registration Issue",
              description: "Unable to create account at the moment. Please try again in a few minutes.",
              variant: "destructive",
            });
            return { success: false, error: "Service temporarily unavailable" };
          }
          
          if (retryData.user) {
            toast({
              title: "Registration Successful",
              description: "Your account has been created successfully!",
            });
            redirectCallback();
            return { success: true, error: null };
          }
        } catch (retryErr) {
          console.error("Sign up retry attempt failed:", retryErr);
        }
        
        toast({
          title: "Registration Service Issue",
          description: "The registration service is experiencing issues. Please try again shortly.",
          variant: "destructive",
        });
        return { success: false, error: "Service temporarily unavailable" };
      }
      
      // Handle other errors
      toast({
        title: "Registration Error",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    // Check for successful sign up
    if (data.user) {
      console.log("Sign up successful");
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });
      redirectCallback();
      return { success: true, error: null };
    }

    // Fallback for unexpected cases
    toast({
      title: "Registration Error", 
      description: "An unexpected error occurred during registration.",
      variant: "destructive",
    });
    return { success: false, error: "Unexpected registration state" };

  } catch (error: any) {
    console.error("Unexpected sign up error:", error);
    toast({
      title: "Registration Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};
