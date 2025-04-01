
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function EmailVerification() {
  const [code, setCode] = useState<string>("");
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract email from URL params
  useEffect(() => {
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
        } else {
          // If no email found, redirect to auth page
          navigate('/auth', { replace: true });
        }
      };
      
      checkSession();
    }
  }, [location, navigate]);

  // Handle code verification
  const handleVerification = async () => {
    if (code.length !== 6 || !email) {
      toast({
        title: "Invalid Input",
        description: code.length !== 6 ? "Please enter the 6-digit code" : "Email address is missing",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Call the verify-code edge function
      const { data, error } = await supabase.functions.invoke('verify-code', {
        body: { 
          email, 
          code 
        }
      });
      
      if (error) {
        throw new Error(error.message || "Failed to verify email");
      }
      
      // Update user metadata to mark email as verified
      await supabase.auth.updateUser({
        data: { email_verified: true }
      });
      
      toast({
        title: "Email Verified!",
        description: "Your email has been successfully verified."
      });
      
      // Redirect to home or profile setup after verification
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
      
    } catch (error: any) {
      console.error("Verification error:", error);
      
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify your email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle resend verification
  const handleResendCode = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email address not found. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsResending(true);
      
      // Resend the verification code
      const { error } = await supabase.functions.invoke('welcome-email', {
        body: { email }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Code Sent",
        description: `A new verification code has been sent to ${email}.`
      });
      
    } catch (error: any) {
      toast({
        title: "Failed to Resend",
        description: error.message || "Failed to send verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">CONFIRM EMAIL</h1>
        
        <p className="text-center text-gray-600 mb-8">
          Enter the email code that we just sent you.
        </p>
        
        <div className="mx-auto max-w-[350px] mb-8">
          <InputOTP 
            maxLength={6} 
            value={code} 
            onChange={setCode}
            disabled={isLoading}
            className="gap-2"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="border-2 border-purple-300 first:border-purple-500 rounded-md h-14 w-12" />
              <InputOTPSlot index={1} className="border-2 border-gray-200 rounded-md h-14 w-12" />
              <InputOTPSlot index={2} className="border-2 border-gray-200 rounded-md h-14 w-12" />
              <InputOTPSlot index={3} className="border-2 border-gray-200 rounded-md h-14 w-12" />
              <InputOTPSlot index={4} className="border-2 border-gray-200 rounded-md h-14 w-12" />
              <InputOTPSlot index={5} className="border-2 border-gray-200 rounded-md h-14 w-12" />
            </InputOTPGroup>
          </InputOTP>
        </div>
        
        {email && (
          <p className="text-center text-gray-500 text-sm mb-4">
            Code sent to {email}
          </p>
        )}
        
        <div className="flex flex-col items-center justify-center gap-4">
          <Button 
            variant="link" 
            className="text-gray-600 hover:text-gray-900 text-sm"
            onClick={handleResendCode}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend code'}
          </Button>
          
          <Button
            className="w-full"
            onClick={handleVerification}
            disabled={code.length !== 6 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Verifying...
              </>
            ) : 'Verify Email'}
          </Button>
        </div>
      </div>
    </div>
  );
}
