
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [isValidSession, setIsValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user has a valid recovery session
    const checkSession = async () => {
      try {
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
        
        // Valid recovery token in URL
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
  }, [navigate, toast]);

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
