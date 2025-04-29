
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  darkMode?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = "Enter password",
  required = true,
  darkMode = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`pl-4 pr-10 py-6 text-lg rounded-md w-full ${
            darkMode ? "bg-gray-900 border-gray-700 text-white placeholder:text-gray-500" : ""
          }`}
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${
            darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
          }`}
          tabIndex={-1}
        >
          {showPassword ? 
            <EyeOff className="h-5 w-5" /> : 
            <Eye className="h-5 w-5" />
          }
        </button>
      </div>
    </div>
  );
};
