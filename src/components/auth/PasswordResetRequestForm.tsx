
import { Button } from "@/components/ui/button";
import { usePasswordReset } from "./hooks/usePasswordReset";
import { EmailInput } from "./components/EmailInput";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PasswordResetRequestForm = () => {
  const { email, setEmail, isLoading, handleResetRequest } = usePasswordReset();
  const [setupStatus, setSetupStatus] = useState<"pending" | "success" | "error">("pending");
  
  // Call the custom-email function to set up email templates when the component mounts
  useEffect(() => {
    const setupCustomEmail = async () => {
      try {
        console.log("Setting up custom email templates");
        setSetupStatus("pending");
        
        // Add a timestamp parameter to prevent caching
        const { data, error } = await supabase.functions.invoke('custom-email', {
          method: 'POST',
          body: { 
            action: 'setup-templates',
            timestamp: new Date().toISOString() 
          }
        });
        
        if (error) {
          console.error("Error setting up custom email:", error);
          setSetupStatus("error");
        } else {
          console.log("Custom email templates set up successfully:", data);
          setSetupStatus("success");
        }
      } catch (err) {
        console.error("Exception setting up custom email:", err);
        setSetupStatus("error");
      }
    };
    
    // Call the setup function immediately
    setupCustomEmail();
    
    // And then again after a short delay to ensure it's applied
    const timer = setTimeout(() => {
      setupCustomEmail();
    }, 2000);
    
    return () => clearTimeout(timer);
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

      {setupStatus === "error" && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            There was an issue setting up the email template. Your password reset email might use the default template.
          </AlertDescription>
        </Alert>
      )}

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
