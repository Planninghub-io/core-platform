
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { setNewPassword } from "./utils/otpUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";

const NewPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Password requirements
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false,
    passwordsMatch: false
  });

  // Validate password as user types
  useEffect(() => {
    const validatePassword = () => {
      const validationResults = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        passwordsMatch: password === confirmPassword && password !== ""
      };
      
      setValidations(validationResults);
      
      const isValid = Object.values(validationResults).every(value => value === true);
      setIsFormValid(isValid);
    };
    
    validatePassword();
  }, [password, confirmPassword]);

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
        navigate("/"); // Redirect to home page after success
      };
      
      await setNewPassword(password, toast, redirectCallback);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
        
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? 
                <EyeOff className="h-4 w-4" /> : 
                <Eye className="h-4 w-4" />
              }
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
            />
            <button
              type="button"
              onClick={toggleShowConfirmPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showConfirmPassword ? 
                <EyeOff className="h-4 w-4" /> : 
                <Eye className="h-4 w-4" />
              }
            </button>
          </div>
        </div>
        
        <div className="text-sm space-y-1 mt-4 border rounded-md p-3 bg-gray-50">
          <h3 className="font-medium">Password Requirements:</h3>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              {validations.minLength ? 
                <CheckCircle className="h-4 w-4 text-green-500" /> : 
                <XCircle className="h-4 w-4 text-red-500" />}
              At least 8 characters
            </li>
            <li className="flex items-center gap-2">
              {validations.hasUpperCase ? 
                <CheckCircle className="h-4 w-4 text-green-500" /> : 
                <XCircle className="h-4 w-4 text-red-500" />}
              At least one uppercase letter
            </li>
            <li className="flex items-center gap-2">
              {validations.hasLowerCase ? 
                <CheckCircle className="h-4 w-4 text-green-500" /> : 
                <XCircle className="h-4 w-4 text-red-500" />}
              At least one lowercase letter
            </li>
            <li className="flex items-center gap-2">
              {validations.hasNumber ? 
                <CheckCircle className="h-4 w-4 text-green-500" /> : 
                <XCircle className="h-4 w-4 text-red-500" />}
              At least one number
            </li>
            <li className="flex items-center gap-2">
              {validations.hasSpecial ? 
                <CheckCircle className="h-4 w-4 text-green-500" /> : 
                <XCircle className="h-4 w-4 text-red-500" />}
              At least one special character
            </li>
            <li className="flex items-center gap-2">
              {validations.passwordsMatch ? 
                <CheckCircle className="h-4 w-4 text-green-500" /> : 
                <XCircle className="h-4 w-4 text-red-500" />}
              Passwords match
            </li>
          </ul>
        </div>
        
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
