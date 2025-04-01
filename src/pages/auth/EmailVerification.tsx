
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useEmailVerification, VerificationForm, VerificationHeader, VerificationFooter } from "@/components/auth/email-verification";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
  const { 
    status, 
    email, 
    isResending, 
    isSubmitting,
    handleCodeVerification, 
    resendVerification 
  } = useEmailVerification();
  
  // Get email from URL params if not set in hook
  const queryParams = new URLSearchParams(location.search);
  const emailFromUrl = queryParams.get('email');
  const displayEmail = email || emailFromUrl;
  
  // Check if user already has verified email
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
        
        // If there's no session, allow them to stay on the page to enter verification code
        if (!data.session) {
          console.log("No session found on verification page");
          setLoading(false);
          return;
        }
        
        // If user is already verified, redirect to home
        if (data.session?.user?.user_metadata?.email_verified === true) {
          console.log("User already verified, redirecting to home");
          navigate('/', { replace: true });
          return;
        }
        
        console.log("User not verified, showing verification page");
        setLoading(false);
      } catch (error) {
        console.error("Error checking verification status:", error);
        setLoading(false);
      }
    };
    
    checkVerificationStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <VerificationHeader status={status} email={displayEmail} />
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
            email={displayEmail} 
            onResendVerification={resendVerification}
            isResending={isResending}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
