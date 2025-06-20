
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
    
    const redirectUrl = `${window.location.origin}/`;
    
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
      
      if (error.message.includes("User already registered")) {
        toast({
          title: "Account Already Exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
        return { success: false, error: "User already exists" };
      }
      
      toast({
        title: "Registration Error",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    if (data.user) {
      console.log("Sign up successful");
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });
      redirectCallback();
      return { success: true, error: null };
    }

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
