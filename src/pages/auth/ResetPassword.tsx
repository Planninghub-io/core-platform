
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
        console.log("Current URL:", window.location.href);
        console.log("Location:", location);
        
        // First check for hash parameters (from email link)
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        console.log("Hash parameters:", { 
          accessToken: !!accessToken, 
          refreshToken: !!refreshToken, 
          type 
        });
        
        // If we have token params from the URL hash, set the session
        if (accessToken && type === 'recovery') {
          console.log("Setting session from hash parameters");
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
        
        // Also check for query parameters (some email clients might convert the hash to query)
        const queryToken = searchParams.get('token');
        const queryType = searchParams.get('type');
        
        console.log("Query parameters:", { queryToken: !!queryToken, queryType });
        
        if (queryToken && queryType === 'recovery') {
          console.log("Setting session from query parameters");
          // Handle query parameter tokens
          // This is a fallback in case the hash is converted to query params
          const { error } = await supabase.auth.verifyOtp({
            token_hash: queryToken,
            type: 'recovery',
          });
          
          if (error) {
            console.error("Error verifying token from query params:", error);
            toast({
              title: "Session Error",
              description: "Unable to validate your recovery token. Please request a new reset link.",
              variant: "destructive",
            });
            navigate("/auth/password-reset");
            return;
          }
          
          setIsValidSession(true);
          setIsLoading(false);
          return;
        }
        
        // If no tokens in URL, check if there's a valid session already
        const { data, error } = await supabase.auth.getSession();
        
        console.log("Session check:", data?.session ? "session exists" : "no session");
        
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
  }, [navigate, toast, location, searchParams]);

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
