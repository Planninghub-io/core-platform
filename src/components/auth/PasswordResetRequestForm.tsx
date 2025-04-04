
import { Button } from "@/components/ui/button";
import { usePasswordReset } from "./hooks/usePasswordReset";
import { EmailInput } from "./components/EmailInput";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const PasswordResetRequestForm = () => {
  const { email, setEmail, isLoading, handleResetRequest } = usePasswordReset();

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
    await handleResetRequest();
  };

  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-2xl font-bold">Reset Password</h1>
      <p className="mb-6 text-gray-600">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <EmailInput
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        
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
