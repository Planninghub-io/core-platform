
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../../../integrations/supabase/client";

export const usePasswordReset = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleResetRequest = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return { success: false, error: "Please enter your email address" };
    }
    
    setIsLoading(true);
    
    try {
      // Get the actual production URL for redirection
      // This ensures we're using yourplanner.ai and not the lovable preview URL
      const hostname = window.location.hostname;
      let baseUrl;
      
      if (hostname === 'yourplanner.ai' || hostname === 'www.yourplanner.ai') {
        baseUrl = 'https://www.yourplanner.ai';
      } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        baseUrl = `${window.location.protocol}//${hostname}:${window.location.port}`;
      } else {
        baseUrl = window.location.origin;
      }
      
      const redirectTo = `${baseUrl}/auth/new-password`;
      console.log("Password reset redirect URL:", redirectTo);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo
      });
      
      if (error) {
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive",
        });
        
        return { success: false, error: error.message };
      }
      
      // Show success information to help the user understand what to do next
      toast({
        title: "Reset Email Sent",
        description: "A password reset link has been sent to your email. Please check your inbox and click the link to reset your password.",
      });
      
      return { success: true, error: null };
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
      
      toast({
        title: "Password Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    handleResetRequest
  };
};
