
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

  if (!email || !password) {
    toast({
      title: "Missing Information",
      description: "Please enter both email and password",
      variant: "destructive",
    });
    return { success: false, error: "Please enter both email and password" };
  }

  if (password.length < 6) {
    toast({
      title: "Weak Password",
      description: "Password must be at least 6 characters long",
      variant: "destructive",
    });
    return { success: false, error: "Password too short" };
  }

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
      
      if (error.message.includes("Password should be at least")) {
        toast({
          title: "Weak Password",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        });
        return { success: false, error: "Password too weak" };
      }
      
      if (error.message.includes("Unable to validate email address")) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return { success: false, error: "Invalid email" };
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
      
      if (data.session) {
        // User is immediately signed in
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully!",
        });
        redirectCallback();
      } else {
        // User needs to verify email
        toast({
          title: "Registration Successful",
          description: "Please check your email for a verification link to complete your registration.",
        });
      }
      
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
