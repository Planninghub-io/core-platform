
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DollarSign, Check, X } from "lucide-react";
import { useState } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  value: string | number | null;
  placeholder?: string;
  isEditing: boolean;
  onChange: (value: string | number) => void;
  type?: "text" | "number" | "textarea" | "select";
  options?: Array<{value: string, label: string}>;
  prefix?: string;
  showEditButton?: boolean;
  onEditClick?: () => void;
}

export const FormField = ({
  id,
  label,
  value,
  placeholder = "",
  isEditing,
  onChange,
  type = "text",
  options = [],
  prefix,
  showEditButton = false,
  onEditClick
}: FormFieldProps) => {
  const [isFieldEditing, setIsFieldEditing] = useState(false);
  const [tempValue, setTempValue] = useState<string | number | null>(value);
  
  const handleFieldClick = () => {
    if (!isEditing && onEditClick) {
      onEditClick();
      setIsFieldEditing(true);
      setTempValue(value);
    }
  };
  
  const handleSaveField = () => {
    if (tempValue !== null) {
      onChange(tempValue);
    }
    setIsFieldEditing(false);
  };

  const handleCancelField = () => {
    setTempValue(value);
    setIsFieldEditing(false);
  };
  
  const handleChange = (newValue: string | number) => {
    if (isFieldEditing) {
      setTempValue(newValue);
    } else {
      onChange(newValue);
    }
  };

  const renderReadOnlyField = () => (
    <div 
      className="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-base ring-offset-background cursor-pointer hover:bg-gray-100"
      onClick={handleFieldClick}
    >
      {prefix && <span className="mr-1">{prefix}</span>}
      {value !== null ? value.toString() : placeholder}
    </div>
  );

  const renderEditableField = () => {
    if (type === "textarea") {
      return (
        <div className="relative">
          <textarea
            id={id}
            className="w-full min-h-[100px] p-2 border rounded-md"
            value={isFieldEditing ? tempValue || '' : value || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
          {isFieldEditing && (
            <div className="absolute bottom-2 right-2 flex space-x-1">
              <Button
                size="sm"
                onClick={handleCancelField}
                className="h-8 w-8 p-0"
                variant="ghost"
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
              <Button
                size="sm"
                onClick={handleSaveField}
                className="h-8 w-8 p-0"
                variant="ghost"
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (type === "select" && options.length > 0) {
      return (
        <div className="relative">
          <Select 
            value={(isFieldEditing ? tempValue : value)?.toString() || ''} 
            onValueChange={(val) => handleChange(val)}
            onOpenChange={(open) => {
              if (!open && isFieldEditing) {
                handleSaveField();
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isFieldEditing && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex space-x-1">
              <Button
                size="sm"
                onClick={handleCancelField}
                className="h-7 w-7 p-0"
                variant="ghost"
              >
                <X className="h-3 w-3 text-gray-500" />
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (prefix) {
      return (
        <div className="flex relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <DollarSign className="h-4 w-4" />
          </div>
          <Input
            id={id}
            type={type}
            value={isFieldEditing ? tempValue || '' : value || ''}
            onChange={(e) => handleChange(type === "number" ? parseInt(e.target.value) : e.target.value)}
            required={id === "title"}
            className="pl-8"
          />
          {isFieldEditing && (
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex space-x-1">
              <Button
                size="sm"
                onClick={handleCancelField}
                className="h-7 w-7 p-0"
                variant="ghost"
              >
                <X className="h-3 w-3 text-gray-500" />
              </Button>
              <Button
                size="sm"
                onClick={handleSaveField}
                className="h-7 w-7 p-0"
                variant="ghost"
              >
                <Check className="h-3 w-3 text-green-500" />
              </Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={isFieldEditing ? tempValue || '' : value || ''}
          onChange={(e) => handleChange(type === "number" ? parseInt(e.target.value) : e.target.value)}
          required={id === "title"}
        />
        {isFieldEditing && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex space-x-1">
            <Button
              size="sm"
              onClick={handleCancelField}
              className="h-7 w-7 p-0"
              variant="ghost"
            >
              <X className="h-3 w-3 text-gray-500" />
            </Button>
            <Button
              size="sm"
              onClick={handleSaveField}
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

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor={id}>{label}</Label>
      </div>
      {isEditing || isFieldEditing ? renderEditableField() : renderReadOnlyField()}
    </div>
  );
};
