
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
    // Sign up with the Supabase client (without captcha)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
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
