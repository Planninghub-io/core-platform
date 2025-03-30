
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { checkProfileSetup } from "@/components/auth/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBusiness = location.state?.type === 'business';
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Check if user needs to complete profile setup
        const needsProfileSetup = await checkProfileSetup();
        if (needsProfileSetup) {
          navigate('/profile-setup');
        } else {
          navigate('/');
        }
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-md">
        <AuthForm type={isBusiness ? 'business' : 'user'} />
      </div>
    </div>
  );
};

export default Auth;
