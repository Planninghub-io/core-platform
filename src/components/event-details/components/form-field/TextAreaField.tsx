
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { EditableFieldProps } from './types';

export const TextAreaField = ({
  id,
  value,
  onChange,
  onSave,
  onCancel,
  isFieldEditing
}: EditableFieldProps) => {
  return (
    <div className="relative">
      <textarea
        id={id}
        className="w-full min-h-[100px] p-2 border rounded-md"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
      {isFieldEditing && (
        <div className="absolute bottom-2 right-2 flex space-x-1">
          <Button
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
            variant="ghost"
          >
            <X className="h-4 w-4 text-gray-500" />
          </Button>
          <Button
            size="sm"
            onClick={onSave}
            className="h-8 w-8 p-0"
            variant="ghost"
          >
            <Check className="h-4 w-4 text-green-500" />
          </Button>
        </div>
      )}
    </div>
  );
};
