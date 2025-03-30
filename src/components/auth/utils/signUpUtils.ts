
import { supabase, APP_URL } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export interface SignUpData {
  email: string;
  password: string;
  role?: string;
}

export const handleUserSignUp = async (
  formData: SignUpData,
  isBusiness: boolean,
  toast: any,
  redirectCallback: () => void
) => {
  const { email, password, role } = formData;

  if (password.length < 6) {
    toast({
      title: "Error",
      description: "Password must be at least 6 characters long",
      variant: "destructive",
    });
    return false;
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role || (isBusiness ? 'business_admin' : 'user'),
          is_business: isBusiness,
          needs_profile_setup: true // Mark user as needing profile setup
        },
        emailRedirectTo: `${APP_URL}/auth/email-verification`
      }
    });

    if (authError) {
      if (authError.message === "User already registered") {
        toast({
          title: "Account Exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
      } else {
        throw authError;
      }
      return false;
    }

    toast({
      title: "Account Created!",
      description: "Please check your email to verify your account.",
    });
    
    // Send welcome email
    try {
      await supabase.functions.invoke('welcome-email', {
        body: { email, isBusiness }
      });
    } catch (emailError) {
      console.error("Welcome email could not be sent:", emailError);
    }
    
    redirectCallback();
    return true;
  } catch (error: any) {
    toast({
      title: "Sign Up Error",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};
