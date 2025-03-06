
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";

type CompanyType = Database["public"]["Enums"]["company_type"];

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  businessPhone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const handleUserSignUp = async (
  formData: SignUpData,
  isBusiness: boolean,
  toast: any,
  redirectCallback: () => void
) => {
  const { email, password, firstName, lastName, companyName, businessPhone } = formData;

  if (password.length < 6) {
    toast({
      title: "Error",
      description: "Password must be at least 6 characters long",
      variant: "destructive",
    });
    return false;
  }

  if (isBusiness && (!companyName || !businessPhone)) {
    toast({
      title: "Error",
      description: "Please fill in all business details",
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
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: window.location.origin
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

    if (isBusiness && authData.user) {
      // Create company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([{
          name: companyName,
          type: 'vendor' as CompanyType,
          business_email: email, // Use the same email
          business_phone: businessPhone
        }])
        .select()
        .single();

      if (companyError) throw companyError;

      if (companyData) {
        // Create user role for the company
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: authData.user.id,
            company_id: companyData.id,
            role: 'admin'
          }]);

        if (roleError) throw roleError;
      }

      // Update user profile type
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ user_type: 'business' })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;
    }

    toast({
      title: "Success!",
      description: "Check your email to confirm your account.",
    });
    
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

export const handleUserSignIn = async (
  formData: SignInData,
  toast: any,
  redirectCallback: () => void
) => {
  const { email, password } = formData;
  if (!email || !password) {
    toast({
      title: "Error",
      description: "Please enter both email and password",
      variant: "destructive",
    });
    return false;
  }
  
  try {
    // First, try to sign in with password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast({
          title: "Sign In Failed",
          description: "Incorrect email or password. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign In Error",
          description: error.message,
          variant: "destructive",
        });
      }
      return false;
    }

    // Check if MFA is required
    if (data.session === null && data.user) {
      // MFA is required, handle accordingly
      toast({
        title: "Verification Required",
        description: "A verification code has been sent to your email.",
      });
      
      // Wait for OTP entry or handle differently based on your UI
      return false;
    }

    redirectCallback();
    return true;
  } catch (error: any) {
    toast({
      title: "Sign In Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

export const handleGoogleSignIn = async (
  isBusiness: boolean,
  toast: any,
  redirectCallback: () => void
) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) {
      toast({
        title: "Google Sign In Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    // No need for redirect callback here as OAuth will handle the redirect
    return true;
  } catch (error: any) {
    toast({
      title: "Google Sign In Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Handle OTP verification
export const verifyOTP = async (
  email: string, 
  token: string,
  toast: any,
  redirectCallback: () => void
) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });

    if (error) {
      toast({
        title: "Verification Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success!",
      description: "Your account has been verified.",
    });
    
    redirectCallback();
    return true;
  } catch (error: any) {
    toast({
      title: "Verification Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Function to set up MFA for a user
export const setupMFA = async (
  factorType: 'totp' | 'email', 
  email?: string,
  phone?: string,
  toast: any
) => {
  try {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType,
      ...(email && { email }),
      ...(phone && { phone })
    });

    if (error) {
      toast({
        title: "MFA Setup Error",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "MFA Setup",
      description: "MFA enrollment initiated. Please check your email or phone for verification.",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "MFA Setup Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Function to verify MFA challenge
export const verifyMFA = async (
  factorId: string,
  challengeId: string,
  code: string,
  toast: any,
  redirectCallback: () => void
) => {
  try {
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId,
      code
    });

    if (error) {
      toast({
        title: "MFA Verification Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success!",
      description: "MFA verification complete.",
    });
    
    redirectCallback();
    return true;
  } catch (error: any) {
    toast({
      title: "MFA Verification Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Function to send OTP for password reset
export const sendPasswordResetOTP = async (
  email: string,
  toast: any
) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      toast({
        title: "Password Reset Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Password Reset",
      description: "Check your email for a password reset link.",
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Password Reset Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};
