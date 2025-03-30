
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const verificationSchema = z.object({
  code: z.string().length(5, "Verification code must be 5 digits"),
});

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'waiting'>('waiting');
  const [email, setEmail] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    // First check if this is a redirect with a token
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (token && type) {
      handleTokenVerification(token, type);
    } else {
      // No token provided, just show verification instructions
      setStatus('waiting');
      
      // Try to get current user's email
      getUserEmail();
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'success' ? (
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
            ) : (
              <div className="flex justify-center">
                <Mail className="h-16 w-16 text-blue-500" />
              </div>
            )}
          </CardTitle>
          <CardTitle className="text-center mt-4">
            {status === 'success' 
              ? 'Email Verified!' 
              : status === 'error' 
                ? 'Verification Failed' 
                : status === 'verifying'
                  ? 'Verifying...'
                  : 'Verify Your Email'}
          </CardTitle>
          <CardDescription className="text-center">
            {status === 'success' 
              ? 'Your email has been successfully verified. You will be redirected shortly.' 
              : status === 'error'
                ? 'We were unable to verify your email. The code may be invalid or expired.'
                : status === 'verifying'
                  ? 'Please wait while we verify your email...'
                  : `We've sent a verification code to ${email || 'your email'}. Please enter the 5-digit code below to verify your account.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'waiting' && email && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCodeVerification)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="mx-auto max-w-[250px]">
                      <FormLabel className="text-center block">Verification Code</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={5} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription className="text-center">
                        Enter the 5-digit code sent to your email
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <Button type="submit" disabled={status === 'verifying'}>
                    {status === 'verifying' ? 'Verifying...' : 'Verify Email'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
          
          {status === 'waiting' && !email && (
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>Looking for your account information...</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          {status === 'success' ? (
            <Button onClick={() => navigate('/')}>
              Continue to Home
            </Button>
          ) : status === 'error' ? (
            <div className="flex flex-col gap-2 w-full">
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Return to Sign In
              </Button>
              {email && (
                <Button onClick={resendVerification}>
                  Resend Verification
                </Button>
              )}
            </div>
          ) : status === 'waiting' && (
            <div className="flex flex-col gap-2 w-full">
              <Button onClick={resendVerification} disabled={!email}>
                Resend Code
              </Button>
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Return to Sign In
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailVerification;
