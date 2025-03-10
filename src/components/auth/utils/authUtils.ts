
import { supabase } from "@/integrations/supabase/client";
import { SignUpData } from "./signUpUtils";
import { SignInData, handleUserSignIn, handleGoogleSignIn } from "./signInUtils";

export type { SignUpData, SignInData };

// Re-export the functions from their respective files
export { 
  handleUserSignIn,
  handleGoogleSignIn,
};

// Handle user sign up
export const handleUserSignUp = async (
  formData: SignUpData,
  isBusiness: boolean = false,
  toast: any,
  redirectCallback: () => void
) => {
  const { email, password, confirmPassword, firstName, lastName } = formData;

  // Check if the passwords match
  if (password !== confirmPassword) {
    toast({
      title: "Passwords don't match",
      description: "Please ensure your passwords match",
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

