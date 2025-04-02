
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { sendPasswordResetOTP } from "./utils/otpUtils";
import { supabase } from "@/integrations/supabase/client";

const PasswordResetRequestForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Call the custom-email function to set up email templates on component mount
  useEffect(() => {
    const setupCustomEmail = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('custom-email');
        if (error) {
          console.error("Error setting up custom email:", error);
        } else {
          console.log("Custom email templates set up successfully:", data);
        }
      } catch (err) {
        console.error("Exception setting up custom email:", err);
      }
    };
    
    setupCustomEmail();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call the password reset function from otpUtils
      await sendPasswordResetOTP(email, toast);
      
      // Show additional information to help the user understand what to do next
      toast({
        title: "Reset Email Sent",
        description: "A password reset link has been sent to your email. Please check your inbox and click the link to reset your password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-2xl font-bold">Reset Password</h1>
      <p className="mb-6 text-gray-600">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="pl-9"
              required
            />
          </div>
        </div>
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <Button variant="outline" onClick={() => window.history.back()} className="mt-4">
          Back to Sign In
        </Button>
      </div>
    </div>
  );
};

export default PasswordResetRequestForm;
