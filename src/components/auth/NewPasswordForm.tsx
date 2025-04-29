
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
    <div className="rounded-xl bg-gray-800 p-8 text-white shadow-lg">
      <div className="flex justify-center mb-8">
        <div className="text-[#8B5CF6] text-3xl font-bold">Planning Hub</div>
      </div>

      <h1 className="mb-4 text-3xl font-bold">Set up a new password</h1>
      <p className="mb-8 text-gray-300">
        Your password must be different from your previous one.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <label className="text-xl font-medium text-gray-200">New password</label>
          <PasswordInput
            id="password"
            label=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            darkMode={true}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xl font-medium text-gray-200">Confirm new password</label>
          <PasswordInput
            id="confirmPassword"
            label=""
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Enter your password again"
            darkMode={true}
          />
        </div>
        
        <PasswordRequirements validations={validations} darkMode={true} />
        
        <Button 
          type="submit" 
          disabled={isLoading || !isFormValid} 
          className="w-full h-14 mt-8 text-xl font-medium bg-gray-400 hover:bg-gray-300 text-black"
        >
          {isLoading ? 'Updating...' : 'Update password'}
        </Button>
      </form>
    </div>
  );
};

export default NewPasswordForm;
