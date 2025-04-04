
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-2">
      <Label htmlFor={id}>Email</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id={id}
          type="email"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="pl-9"
          required={required}
        />
      </div>
    </div>
  );
};
