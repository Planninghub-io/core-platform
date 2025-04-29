
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
    // Check if the user has a valid recovery session
    const checkSession = async () => {
      try {
        console.log("ResetPassword: Initializing");
        console.log("Current URL:", window.location.href);
        
        // First check if this is a recovery URL with token in the URL parameters
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        console.log("URL parameters:", { 
          token: token ? "present" : "not present", 
          type 
        });
        
        // If we have a recovery token in the URL
        if (token && type === 'recovery') {
          console.log("Found recovery token in URL params, verifying...");
          
          // Try to verify the recovery token
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
        
        // Check for hash parameters (from email link that uses #)
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const hashType = hashParams.get('type');
        
        console.log("Hash parameters:", { 
          accessToken: accessToken ? "present" : "not present", 
          type: hashType 
        });
        
        // IMPORTANT: We're now handling 'recovery' type specifically, not just any token
        if (accessToken && hashType === 'recovery') {
          console.log("Found access token in URL hash for recovery, setting session...");
          
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
          
          setIsValidSession(true);
          setIsLoading(false);
          return;
        }
        
        // As a fallback, check if there's already a valid session
        // But make sure it's from a recovery flow, not a regular login
        const { data: sessionData } = await supabase.auth.getSession();
        
        console.log("Session check:", sessionData?.session ? "session exists" : "no session");
        
        // Only accept the session if we're in a recovery flow
        const urlHasRecoveryIndicator = 
          window.location.href.includes('type=recovery') || 
          window.location.href.includes('new-password');
        
        if (sessionData.session && urlHasRecoveryIndicator) {
          console.log("Valid recovery session found");
          setIsValidSession(true);
          setIsLoading(false);
          return;
        } else if (sessionData.session) {
          console.log("Session exists but not from recovery flow, redirecting to home");
          navigate("/");
          return;
        }
        
        // No valid recovery token or session found
        console.log("No valid recovery token or session found, redirecting to password reset page");
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
