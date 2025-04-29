
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
  darkMode?: boolean;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ validations, darkMode = false }) => {
  return (
    <div className={`text-sm space-y-1 mt-4 border rounded-md p-3 ${
      darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50"
    }`}>
      <h3 className={`font-medium ${darkMode ? "text-gray-200" : ""}`}>Password Requirements:</h3>
      <ul className="space-y-1">
        <li className="flex items-center gap-2">
          {validations.minLength ? 
            <CheckCircle className="h-4 w-4 text-green-500" /> : 
            <XCircle className={`h-4 w-4 ${darkMode ? "text-red-400" : "text-red-500"}`} />}
          <span className={darkMode ? "text-gray-300" : ""}>At least 8 characters</span>
        </li>
        <li className="flex items-center gap-2">
          {validations.hasUpperCase ? 
            <CheckCircle className="h-4 w-4 text-green-500" /> : 
            <XCircle className={`h-4 w-4 ${darkMode ? "text-red-400" : "text-red-500"}`} />}
          <span className={darkMode ? "text-gray-300" : ""}>At least one uppercase letter</span>
        </li>
        <li className="flex items-center gap-2">
          {validations.hasLowerCase ? 
            <CheckCircle className="h-4 w-4 text-green-500" /> : 
            <XCircle className={`h-4 w-4 ${darkMode ? "text-red-400" : "text-red-500"}`} />}
          <span className={darkMode ? "text-gray-300" : ""}>At least one lowercase letter</span>
        </li>
        <li className="flex items-center gap-2">
          {validations.hasNumber ? 
            <CheckCircle className="h-4 w-4 text-green-500" /> : 
            <XCircle className={`h-4 w-4 ${darkMode ? "text-red-400" : "text-red-500"}`} />}
          <span className={darkMode ? "text-gray-300" : ""}>At least one number</span>
        </li>
        <li className="flex items-center gap-2">
          {validations.hasSpecial ? 
            <CheckCircle className="h-4 w-4 text-green-500" /> : 
            <XCircle className={`h-4 w-4 ${darkMode ? "text-red-400" : "text-red-500"}`} />}
          <span className={darkMode ? "text-gray-300" : ""}>At least one special character</span>
        </li>
        <li className="flex items-center gap-2">
          {validations.passwordsMatch ? 
            <CheckCircle className="h-4 w-4 text-green-500" /> : 
            <XCircle className={`h-4 w-4 ${darkMode ? "text-red-400" : "text-red-500"}`} />}
          <span className={darkMode ? "text-gray-300" : ""}>Passwords match</span>
        </li>
      </ul>
    </div>
  );
};
