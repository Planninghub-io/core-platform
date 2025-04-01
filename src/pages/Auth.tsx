
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { checkProfileSetup } from "@/components/auth/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBusiness = location.state?.type === 'business';
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("Session exists, checking email verification status");
          
          // Check if the user email is verified
          const emailVerified = data.session.user.user_metadata.email_verified === true;
          
          if (!emailVerified) {
            // If email is not verified, redirect to verification page
            console.log("Email not verified, redirecting to verification page");
            const email = data.session.user.email;
            navigate(`/auth/email-verification?email=${encodeURIComponent(email)}`, { replace: true });
            return;
          }
          
          console.log("Email verified, checking if profile setup is needed");
          
          // Check if user needs to complete profile setup
          const needsProfileSetup = await checkProfileSetup();
          if (needsProfileSetup) {
            console.log("Profile setup needed, redirecting to profile setup");
            navigate('/profile-setup', { replace: true });
          } else {
            console.log("Profile setup not needed, redirecting to home");
            navigate('/', { replace: true });
          }
        } else {
          console.log("No session found, showing auth form");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-md">
        <AuthForm type={isBusiness ? 'business' : 'user'} />
      </div>
    </div>
  );
};

export default Auth;
