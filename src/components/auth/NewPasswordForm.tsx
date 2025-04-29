
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { setNewPassword } from "./utils/passwordUpdateUtils";
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
        // Always redirect back to login after password reset success
        navigate("/auth"); 
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
    <div className="rounded-xl bg-white p-8 text-gray-800 shadow-lg">
      <div className="flex justify-center mb-8">
        <div className="text-[#8B5CF6] text-3xl font-bold">PlannerAI</div>
      </div>

      <h1 className="mb-4 text-3xl font-bold text-gray-900">Set up a new password</h1>
      <p className="mb-8 text-gray-600">
        Your password must be different from your previous one.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <label className="text-xl font-medium text-gray-700">New password</label>
          <PasswordInput
            id="password"
            label=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            darkMode={false}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xl font-medium text-gray-700">Confirm new password</label>
          <PasswordInput
            id="confirmPassword"
            label=""
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Enter your password again"
            darkMode={false}
          />
        </div>
        
        <PasswordRequirements validations={validations} darkMode={false} />
        
        <Button 
          type="submit" 
          disabled={isLoading || !isFormValid} 
          className="w-full h-14 mt-8 text-xl font-medium bg-[#8B5CF6] hover:bg-[#7C5AE0] text-white"
        >
          {isLoading ? 'Updating...' : 'Update password'}
        </Button>
      </form>
    </div>
  );
};

export default NewPasswordForm;
