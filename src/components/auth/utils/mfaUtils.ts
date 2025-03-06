
import { supabase } from "@/integrations/supabase/client";

// Function to set up MFA for a user
export const setupMFA = async (
  factorType: 'totp' | 'email', 
  toast: any,
  email?: string,
  phone?: string
) => {
  try {
    let params: any = {};
    
    // Choose the correct factor type for Supabase MFA
    if (factorType === 'totp') {
      params = { factorType: 'totp' };
    } else if (factorType === 'email' && email) {
      // Note: Supabase doesn't support email as factorType directly
      // We're adapting to use phone factor type with the email
      params = { 
        factorType: 'phone',
        phone: email // Using email in place of phone for demonstration
      };
    } else {
      toast({
        title: "MFA Setup Error",
        description: "Invalid factor type or missing email",
        variant: "destructive",
      });
      return null;
    }

    const { data, error } = await supabase.auth.mfa.enroll(params);

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
    // First, create a challenge with the factor ID
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId
    });
    
    if (error) {
      toast({
        title: "MFA Verification Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    // Then verify the challenge with the provided code
    // Use the challenge ID from the response instead of the parameter
    const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: data.id, // Use the challenge ID from the response
      code
    });

    if (verifyError) {
      toast({
        title: "MFA Verification Error",
        description: verifyError.message,
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
