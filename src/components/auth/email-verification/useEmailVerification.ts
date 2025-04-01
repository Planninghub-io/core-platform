
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Update the type to include all possible states
export type VerificationStatus = 'waiting' | 'verifying' | 'success' | 'error';

const verificationSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits")
});

export const useEmailVerification = () => {
  const [status, setStatus] = useState<VerificationStatus>('waiting');
  const [email, setEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract email from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Try to get email from session if not in URL
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setEmail(session.user.email);
        }
      };
      
      checkSession();
    }
  }, [location]);

  const handleCodeVerification = async (formData: { code: string }) => {
    try {
      setStatus('verifying');
      
      if (!email) {
        throw new Error("Email address not found. Please try again.");
      }
      
      const result = verificationSchema.safeParse(formData);
      
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }
      
      // Call the verify-code edge function
      const { data, error } = await supabase.functions.invoke('verify-code', {
        body: { 
          email, 
          code: formData.code 
        }
      });
      
      if (error) {
        throw new Error(error.message || "Failed to verify email");
      }
      
      toast({
        title: "Email Verified!",
        description: "Your email has been successfully verified."
      });
      
      setStatus('success');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error: any) {
      console.error("Verification error:", error);
      setStatus('error');
      
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify your email. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const resendVerification = async () => {
    try {
      if (!email) {
        throw new Error("Email address not found. Please try again.");
      }
      
      setStatus('waiting');
      
      // Resend the verification code
      const { error } = await supabase.functions.invoke('welcome-email', {
        body: { email }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Verification Code Sent",
        description: `A new verification code has been sent to ${email}.`
      });
    } catch (error: any) {
      console.error("Error resending verification:", error);
      
      toast({
        title: "Failed to Resend",
        description: error.message || "Failed to send verification code. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    status,
    email,
    handleCodeVerification,
    resendVerification
  };
};
