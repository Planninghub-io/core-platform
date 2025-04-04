
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface PasswordRequirementsProps {
  validations: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    passwordsMatch: boolean;
  };
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ validations }) => {
  return (
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
  );
};
