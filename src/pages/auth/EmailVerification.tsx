
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useEmailVerification, VerificationForm, VerificationHeader, VerificationFooter } from "@/components/auth/email-verification";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function EmailVerification() {
  const navigate = useNavigate();
  
  const { 
    status, 
    email, 
    isResending, 
    isSubmitting,
    handleCodeVerification, 
    resendVerification 
  } = useEmailVerification();
  
  // Check if user already has verified email
  useEffect(() => {
    const checkVerificationStatus = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.user_metadata?.email_verified === true) {
        // User is already verified, redirect to home
        navigate('/', { replace: true });
      }
    };
    
    checkVerificationStatus();
  }, [navigate]);

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <VerificationHeader status={status} email={email} />
        </CardHeader>
        
        <CardContent>
          {status === 'waiting' && (
            <VerificationForm 
              onSubmit={handleCodeVerification} 
              isSubmitting={isSubmitting} 
            />
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <VerificationFooter 
            status={status} 
            email={email} 
            onResendVerification={resendVerification}
            isResending={isResending}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
