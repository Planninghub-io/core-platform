
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [isValidSession, setIsValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("ResetPassword: Checking recovery session");
        console.log("Current URL:", window.location.href);
        
        // Check for recovery token in URL parameters
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        console.log("URL parameters:", { 
          token: token ? "present" : "not present", 
          type 
        });
        
        // Handle recovery token from URL
        if (token && type === 'recovery') {
          console.log("Found recovery token in URL, verifying...");
          
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery',
          });
          
          if (error) {
            console.error("Error verifying recovery token:", error);
            toast({
              title: "Password Reset Error",
              description: "Your password reset link is invalid or has expired. Please request a new one.",
              variant: "destructive",
            });
            navigate("/auth/password-reset");
            return;
          }
          
          console.log("Recovery token verified successfully");
          setIsValidSession(true);
          setIsLoading(false);
          return;
        }
        
        // Check for hash parameters (from email link)
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const hashType = hashParams.get('type');
        
        console.log("Hash parameters:", { 
          accessToken: accessToken ? "present" : "not present", 
          type: hashType 
        });
        
        if (accessToken && hashType === 'recovery') {
          console.log("Found recovery tokens in hash, setting session...");
          
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          
          if (error) {
            console.error("Error setting session from hash:", error);
            toast({
              title: "Session Error",
              description: "Unable to validate your session. Please request a new reset link.",
              variant: "destructive",
            });
            navigate("/auth/password-reset");
            return;
          }
          
          console.log("Recovery session set successfully");
          setIsValidSession(true);
          setIsLoading(false);
          return;
        }
        
        // Check for existing session
        const { data: sessionData } = await supabase.auth.getSession();
        
        console.log("Current session:", sessionData?.session ? "exists" : "no session");
        
        if (sessionData.session) {
          // Check if this is a recovery session by checking the current URL
          const isRecoveryContext = 
            window.location.pathname.includes('new-password') ||
            window.location.href.includes('type=recovery') ||
            document.referrer.includes('password-reset');
          
          if (isRecoveryContext) {
            console.log("Valid recovery session found");
            setIsValidSession(true);
            setIsLoading(false);
            return;
          } else {
            console.log("Regular session found, redirecting to home");
            navigate("/");
            return;
          }
        }
        
        // No valid recovery session found
        console.log("No valid recovery session, redirecting to password reset");
        toast({
          title: "Invalid Session",
          description: "Your password reset session has expired or is invalid. Please request a new reset link.",
          variant: "destructive",
        });
        navigate("/auth/password-reset");
      } catch (err) {
        console.error("Error in reset password flow:", err);
        toast({
          title: "Error",
          description: "An error occurred during the password reset process.",
          variant: "destructive",
        });
        navigate("/auth/password-reset");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, [navigate, toast, location, searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#8B5CF6]"></div>
      </div>
    );
  }

  if (!isValidSession) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <NewPasswordForm />
      </div>
    </div>
  );
};

export default ResetPassword;
