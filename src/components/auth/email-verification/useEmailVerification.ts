
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Update the type to include all possible states
export type VerificationStatus = 'waiting' | 'verifying' | 'success' | 'error';

const verificationSchema = z.object({
  code: z.string().length(5, "Verification code must be 5 digits"),
});

export function useEmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<VerificationStatus>('waiting');
  const [email, setEmail] = useState<string | null>(null);
  
  useEffect(() => {
    // First check if this is a redirect with a token
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (token && type) {
      handleTokenVerification(token, type);
    } else {
      // No token provided, just show verification instructions
      setStatus('waiting');
      
      // Try to get email from URL parameters first
      const emailParam = searchParams.get('email');
      if (emailParam) {
        setEmail(emailParam);
      } else {
        // If no email in URL, try to get current user's email
        getUserEmail();
      }
    }
  }, [searchParams]);

  const getUserEmail = async () => {
    const { data } = await supabase.auth.getUser();
    if (data && data.user) {
      setEmail(data.user.email);
    }
  };

  const handleTokenVerification = async (token: string, type: string) => {
    try {
      setStatus('verifying');
      
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type as any,
      });
      
      if (error) {
        console.error("Email verification error:", error);
        setStatus('error');
        toast({
          title: "Verification Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Successfully verified
      setStatus('success');
      setEmail(data.user?.email || null);
      
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified.",
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      console.error("Verification error:", error);
      setStatus('error');
      toast({
        title: "Verification Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCodeVerification = async (values: z.infer<typeof verificationSchema>) => {
    if (!email) return;
    
    try {
      setStatus('verifying');
      
      // Verify the OTP code
      const { data, error } = await supabase.functions.invoke('verify-code', {
        body: { email, code: values.code }
      });
      
      if (error) {
        setStatus('error');
        toast({
          title: "Verification Failed",
          description: error.message || "Invalid verification code",
          variant: "destructive",
        });
        return;
      }
      
      // Successfully verified
      setStatus('success');
      
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified.",
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      setStatus('error');
      toast({
        title: "Verification Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const resendVerification = async () => {
    if (!email) return;
    
    try {
      // Re-send the welcome email with a new verification code
      const { error } = await supabase.functions.invoke('welcome-email', {
        body: { email }
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to resend verification email",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Verification Email Sent",
        description: "Check your inbox for the verification code",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification email",
        variant: "destructive",
      });
    }
  };

  return {
    status,
    email,
    handleCodeVerification,
    resendVerification
  };
}
