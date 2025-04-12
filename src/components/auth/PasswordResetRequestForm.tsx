
import { Button } from "@/components/ui/button";
import { usePasswordReset } from "./hooks/usePasswordReset";
import { EmailInput } from "./components/EmailInput";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PasswordResetRequestForm = () => {
  const navigate = useNavigate();
  const { email, setEmail, isLoading, handleResetRequest } = usePasswordReset();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailSent(false);
    setError(null);
    
    try {
      const result = await handleResetRequest();
      if (result?.success) {
        setIsEmailSent(true);
      } else if (result?.error) {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  const handleClose = () => {
    navigate('/auth');
  };

  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      <div className="flex justify-end">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleClose}
          className="hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-500" />
        </Button>
      </div>
      
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
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      {isEmailSent && (
        <Alert className="mt-4 border-green-100 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="ml-2 text-green-700">
            Password reset email sent! Please check your inbox and follow the instructions to reset your password.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PasswordResetRequestForm;
