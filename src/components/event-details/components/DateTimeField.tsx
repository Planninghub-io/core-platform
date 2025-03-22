
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface DateTimeFieldProps {
  label: string;
  dateValue: string;
  timeValue: string;
  isEditing: boolean;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  id: string;
  showEditButton?: boolean;
  onEditClick?: () => void;
}

export const DateTimeField = ({
  label,
  dateValue,
  timeValue,
  isEditing,
  onDateChange,
  onTimeChange,
  id,
  showEditButton = false,
  onEditClick
}: DateTimeFieldProps) => {
  const [isFieldEditing, setIsFieldEditing] = useState(false);
  const [tempDateValue, setTempDateValue] = useState(dateValue);
  const [tempTimeValue, setTempTimeValue] = useState(timeValue);
  
  const handleFieldClick = () => {
    if (!isEditing && onEditClick) {
      onEditClick();
      setIsFieldEditing(true);
      setTempDateValue(dateValue);
      setTempTimeValue(timeValue);
    }
  };
  
  const handleSaveField = () => {
    onDateChange(tempDateValue);
    onTimeChange(tempTimeValue);
    setIsFieldEditing(false);
  };

  const handleCancelField = () => {
    setTempDateValue(dateValue);
    setTempTimeValue(timeValue);
    setIsFieldEditing(false);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (e) {
      return dateString || "";
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return format(time, "h:mm a");
    } catch (e) {
      return timeString || "";
    }
  };

  // Split the label to extract main prefix (Start/End)
  const labelPrefix = label.split(" ")[0]; // This will get "Start" or "End"

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor={`${id}-date`}>{label}</Label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          {(isEditing || isFieldEditing) ? (
            <Input
              id={`${id}-date`}
              type="date"
              value={isFieldEditing ? tempDateValue : dateValue}
              onChange={(e) => isFieldEditing ? setTempDateValue(e.target.value) : onDateChange(e.target.value)}
              required
              className="rounded-r-none"
            />
          ) : (
            <div 
              className="flex h-10 w-full rounded-l-md border border-input bg-gray-50 px-3 py-2 text-base ring-offset-background border-r-0 cursor-pointer hover:bg-gray-100"
              onClick={handleFieldClick}
            >
              <span>{formatDate(dateValue)}</span>
            </div>
          )}
        </div>
        <div className="relative">
          {(isEditing || isFieldEditing) ? (
            <div className="relative">
              <Input
                id={`${id}-time`}
                type="time"
                value={isFieldEditing ? tempTimeValue : timeValue}
                onChange={(e) => isFieldEditing ? setTempTimeValue(e.target.value) : onTimeChange(e.target.value)}
                required
                className="rounded-l-none border-l-0"
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
          ) : (
            <div 
              className="flex h-10 w-full rounded-r-md border border-input bg-gray-50 px-3 py-2 text-base ring-offset-background cursor-pointer hover:bg-gray-100"
              onClick={handleFieldClick}
            >
              <span>{formatTime(timeValue)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
