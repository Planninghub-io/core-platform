
import { Button } from "@/components/ui/button";
import { usePasswordReset } from "./hooks/usePasswordReset";
import { EmailInput } from "./components/EmailInput";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PasswordResetRequestForm = () => {
  const { email, setEmail, isLoading, handleResetRequest } = usePasswordReset();
  const [isSettingUpTemplate, setIsSettingUpTemplate] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSettingUpTemplate(false);
    await handleResetRequest();
  };

  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-2xl font-bold">Reset Password</h1>
      <p className="mb-6 text-gray-600">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {isSettingUpTemplate && (
        <div className="mb-4 flex items-center text-sm text-gray-600">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Setting up custom email template...
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <EmailInput
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        
        <Button type="submit" disabled={isLoading || isSettingUpTemplate} className="w-full">
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
