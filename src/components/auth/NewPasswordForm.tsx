
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { setNewPassword } from "./utils/authUtils";
import { usePasswordValidation } from "./hooks/usePasswordValidation";
import { PasswordInput } from "./components/PasswordInput";
import { PasswordRequirements } from "./components/PasswordRequirements";

const NewPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { validations, isFormValid } = usePasswordValidation(password, confirmPassword);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!isFormValid) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const redirectCallback = () => {
        toast({
          title: "Password Updated Successfully",
          description: "Your password has been reset. You can now log in with your new password.",
        });
        navigate("/auth"); // Redirect to login page after success
      };
      
      const result = await setNewPassword(password, toast, redirectCallback);
      
      if (!result.success) {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      console.error("Password update error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-2xl font-bold">Set New Password</h1>
      <p className="mb-6 text-gray-600">
        Create a new password for your account.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <PasswordInput
          id="password"
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your new password"
        />
        
        <PasswordInput
          id="confirmPassword"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your new password"
        />
        
        <PasswordRequirements validations={validations} />
        
        <Button 
          type="submit" 
          disabled={isLoading || !isFormValid} 
          className="w-full mt-6"
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
};

export default NewPasswordForm;
