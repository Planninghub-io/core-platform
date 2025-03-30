
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // First check if this is a redirect with a token
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    const verifyToken = async () => {
      if (token && type) {
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
      } else {
        // No token provided, just show verification instructions
        setStatus('verifying');
        
        // Try to get current user's email
        const { data } = await supabase.auth.getUser();
        if (data && data.user) {
          setEmail(data.user.email);
        }
      }
    };
    
    verifyToken();
  }, [searchParams, toast, navigate]);

  const resendVerification = async () => {
    if (!email) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Verification Email Sent",
        description: "Check your inbox for the verification link",
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
                : 'Check Your Email'}
          </CardTitle>
          <CardDescription className="text-center">
            {status === 'success' 
              ? 'Your email has been successfully verified. You will be redirected shortly.' 
              : status === 'error'
                ? 'We were unable to verify your email. The link may have expired or been used already.'
                : `We've sent a verification link to ${email || 'your email'}. Please check your inbox and click the link to verify your account.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'verifying' && (
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>If you don't see the email, check your spam folder or request a new verification link.</p>
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
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <Button onClick={resendVerification} disabled={!email}>
                Resend Verification
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
