
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DollarSign, Pencil } from "lucide-react";

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
  const renderReadOnlyField = () => (
    <div className="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-base ring-offset-background">
      {prefix && <span className="mr-1">{prefix}</span>}
      {value !== null ? value.toString() : placeholder}
    </div>
  );

  const renderEditableField = () => {
    if (type === "textarea") {
      return (
        <textarea
          id={id}
          className="w-full min-h-[100px] p-2 border rounded-md"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }

    if (type === "select" && options.length > 0) {
      return (
        <Select 
          value={value?.toString() || ''} 
          onValueChange={(val) => onChange(val)}
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
            value={value || ''}
            onChange={(e) => onChange(type === "number" ? parseInt(e.target.value) : e.target.value)}
            required={id === "title"}
            className="pl-8"
          />
        </div>
      );
    }

    return (
      <Input
        id={id}
        type={type}
        value={value || ''}
        onChange={(e) => onChange(type === "number" ? parseInt(e.target.value) : e.target.value)}
        required={id === "title"}
      />
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor={id}>{label}</Label>
        {showEditButton && onEditClick && (
          <button 
            onClick={onEditClick}
            className="p-1 text-gray-400 hover:text-purple-600 rounded-full hover:bg-purple-50"
            aria-label={`Edit ${label}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {isEditing ? renderEditableField() : renderReadOnlyField()}
    </div>
  );
};
