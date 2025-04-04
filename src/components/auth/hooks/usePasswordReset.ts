
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendPasswordResetOTP } from "../utils/otpUtils";

export const usePasswordReset = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleResetRequest = async () => {
    setIsLoading(true);
    
    try {
      // Call the password reset function from otpUtils
      const result = await sendPasswordResetOTP(email, toast);
      
      if (result.success) {
        // Show additional information to help the user understand what to do next
        toast({
          title: "Reset Email Sent",
          description: "A password reset link has been sent to your email. Please check your inbox and click the link to reset your password.",
        });
      }
      
      return result;
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
