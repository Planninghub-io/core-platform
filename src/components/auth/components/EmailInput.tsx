
import React from "react";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

interface EmailInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "Enter your email",
  required = true
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Mail className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        id={id}
        type="email"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 py-3 text-lg rounded-md w-full"
        required={required}
      />
    </div>
  );
};
