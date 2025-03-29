
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { InputFieldProps } from './types';

export const StandardInputField = ({
  id,
  type,
  value,
  onChange,
  onSave,
  onCancel,
  isFieldEditing,
  required
}: InputFieldProps) => {
  return (
    <div className="relative">
      <Input
        id={id}
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(type === "number" ? parseInt(e.target.value) : e.target.value)}
        required={required}
      />
      {isFieldEditing && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex space-x-1">
          <Button
            size="sm"
            onClick={onCancel}
            className="h-7 w-7 p-0"
            variant="ghost"
          >
            <X className="h-3 w-3 text-gray-500" />
          </Button>
          <Button
            size="sm"
            onClick={onSave}
            className="h-7 w-7 p-0"
            variant="ghost"
          >
            <Check className="h-3 w-3 text-green-500" />
          </Button>
        </div>
      )}
    </div>
  );
};
