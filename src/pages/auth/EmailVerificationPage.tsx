
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleVerification = async () => {
    if (code.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
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
        description: "Your email has been successfully verified.",
      });
      
      // Redirect to home after a short delay
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
      setIsSubmitting(false);
    }
  };

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
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
        <CardDescription className="text-center">
          We've sent a verification code to {email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-center text-sm text-gray-500 mb-4">
            Please enter the verification code to continue
          </div>
          
          <div className="flex justify-center mb-6">
            <InputOTP 
              maxLength={6} 
              value={code} 
              onChange={setCode}
              disabled={isSubmitting}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleVerification} 
              disabled={code.length !== 6 || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Verifying...
                </>
              ) : 'Verify Email'}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={handleResendCode}
              disabled={isResending}
              className="mt-2"
            >
              {isResending ? 'Sending...' : "Didn't receive a code? Resend"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationPage;
