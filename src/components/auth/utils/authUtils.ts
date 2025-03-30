
import { supabase } from "@/integrations/supabase/client";
import { SignUpData } from "./signUpUtils";
import { SignInData, handleUserSignIn, handleGoogleSignIn, handleAppleSignIn } from "./signInUtils";
import { sendPasswordResetOTP, setNewPassword as otpSetNewPassword } from "./otpUtils";
import { setupMFA, verifyMFA } from "./mfaUtils";

export type { SignUpData, SignInData };

// Re-export the functions from their respective files
export { 
  handleUserSignIn,
  handleGoogleSignIn,
  handleAppleSignIn,
  sendPasswordResetOTP,
  setupMFA,
  verifyMFA
};

// Handle user sign up
export const handleUserSignUp = async (
  formData: SignUpData,
  isBusiness: boolean = false,
  toast: any,
  redirectCallback: () => void
) => {
  const { email, password, firstName, lastName, acceptedTerms } = formData;

  if (!acceptedTerms) {
    toast({
      title: "Terms Required",
      description: "You must accept the Terms of Service to continue",
      variant: "destructive",
    });
    return false;
  }

  try {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          is_business: isBusiness,
          accepted_terms: acceptedTerms,
          role: formData.role || (isBusiness ? "business_admin" : "user")
        },
      },
    });

    if (error) {
      throw error;
    }

    // If email confirmation is required
    if (data?.user && !data?.session) {
      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link to verify your email",
      });
      
      // Try to send welcome email
      try {
        await supabase.functions.invoke('welcome-email', {
          body: { email, firstName, lastName, isBusiness }
        });
      } catch (emailError) {
        console.error("Welcome email could not be sent:", emailError);
        // Don't fail the signup if welcome email fails
      }
      
      return false;
    }

    // Success
    toast({
      title: "Account created successfully",
      description: "Welcome to EventIt!",
    });
    
    redirectCallback();
    return true;
  } catch (error: any) {
    if (error.message.includes("already registered")) {
      toast({
        title: "Email already in use",
        description: "This email is already registered. Please sign in instead.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
    }
    return false;
  }
};

// Set new password (using the implementation from otpUtils to avoid duplication)
export const setNewPassword = otpSetNewPassword;
