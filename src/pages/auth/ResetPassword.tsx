
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [isValidSession, setIsValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user has a valid recovery session
    const checkSession = async () => {
      try {
        // Get parameters from the URL if they exist (from email link)
        const params = new URLSearchParams(location.hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');
        
        console.log("URL parameters:", { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        
        // If we have token params from the URL, set the session
        if (accessToken && type === 'recovery') {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          
          if (error) {
            console.error("Error setting session:", error);
            toast({
              title: "Session Error",
              description: "Unable to validate your session. Please request a new reset link.",
              variant: "destructive",
            });
            navigate("/auth/password-reset");
            return;
          }
          
          setIsValidSession(true);
          setIsLoading(false);
          return;
        }
        
        // If no token in URL, check if there's a valid session
        const { data, error } = await supabase.auth.getSession();
        
        console.log("Session check:", data, error);
        
        if (!data.session) {
          console.log("No session found, redirecting to password reset page");
          toast({
            title: "Session Expired",
            description: "Your password reset session has expired. Please request a new reset link.",
            variant: "destructive",
          });
          navigate("/auth/password-reset");
          return;
        }
        
        // Valid session exists
        setIsValidSession(true);
      } catch (err) {
        console.error("Error checking session:", err);
        toast({
          title: "Error",
          description: "An error occurred while validating your session.",
          variant: "destructive",
        });
        navigate("/auth/password-reset");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, [navigate, toast, location]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#8B5CF6]"></div>
      </div>
    );
  }

  if (!isValidSession) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-md">
        <NewPasswordForm />
      </div>
    </div>
  );
};

export default ResetPassword;
