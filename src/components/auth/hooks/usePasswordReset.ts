
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendPasswordResetOTP } from "../utils/passwordResetUtils";

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
      const result = await sendPasswordResetOTP(email, toast);
      return result;
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
