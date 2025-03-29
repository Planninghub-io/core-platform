
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SelectFieldProps } from './types';

export const SelectField = ({
  value,
  onChange,
  onSave,
  onCancel,
  isFieldEditing,
  options,
  placeholder
}: SelectFieldProps) => {
  return (
    <div className="relative">
      <Select 
        value={value?.toString() || ''} 
        onValueChange={(val) => onChange(val)}
        onOpenChange={(open) => {
          if (!open && isFieldEditing) {
            onSave();
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
            onClick={onCancel}
            className="h-7 w-7 p-0"
            variant="ghost"
          >
            <X className="h-3 w-3 text-gray-500" />
          </Button>
        </div>
      )}
    </div>
  );
};
