
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
  
  try {
    console.log("Attempting sign in with email:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password
    });
    
    console.log("Sign in response:", { data, error });
    
    if (error) {
      console.error("Sign in error:", error);
      
      if (error.message.includes("Invalid login credentials")) {
        toast({
          title: "Sign In Failed",
          description: "Incorrect email or password. Please try again.",
          variant: "destructive",
        });
        return { success: false, error: "Invalid credentials" };
      }
      
      toast({
        title: "Sign In Error",
        description: error.message || "An error occurred during sign in",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    if (data.session && data.user) {
      console.log("Sign in successful");
      redirectCallback();
      return { success: true, error: null };
    }

    if (!data.session && data.user) {
      toast({
        title: "Verification Required",
        description: "Please check your email for a verification link.",
      });
      return { success: false, error: "Email verification required" };
    }

    toast({
      title: "Sign In Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: "Unexpected authentication state" };

  } catch (error: any) {
    console.error("Unexpected sign in error:", error);
    toast({
      title: "Sign In Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { success: false, error: "An unexpected error occurred" };
  }
};
