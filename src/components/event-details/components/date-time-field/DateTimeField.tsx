
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { DateTimeReadOnlyField } from "./DateTimeReadOnlyField";
import { formatDate, formatTime } from "../../utils/dateTimeFormatters";

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
  minDate?: string; // Add minDate constraint
  minTime?: string; // Add minTime constraint
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
  onEditClick,
  minDate,
  minTime
}: DateTimeFieldProps) => {
  const [isFieldEditing, setIsFieldEditing] = useState(false);
  const [tempDateValue, setTempDateValue] = useState(dateValue || "");
  const [tempTimeValue, setTempTimeValue] = useState(timeValue || "");
  
  // Update local state when props change
  useEffect(() => {
    setTempDateValue(dateValue || "");
    setTempTimeValue(timeValue || "");
  }, [dateValue, timeValue]);
  
  const handleFieldClick = () => {
    if (showEditButton && onEditClick) {
      onEditClick();
      setIsFieldEditing(true);
    }
  };
  
  const handleSaveField = () => {
    // Validate date and time before saving
    if (minDate && tempDateValue === minDate && minTime && tempTimeValue < minTime) {
      // If time is before minTime on the same date, adjust to minTime
      setTempTimeValue(minTime);
      onDateChange(tempDateValue);
      onTimeChange(minTime);
    } else {
      onDateChange(tempDateValue);
      onTimeChange(tempTimeValue);
    }
    setIsFieldEditing(false);
  };

  const handleCancelField = () => {
    setTempDateValue(dateValue || "");
    setTempTimeValue(timeValue || "");
    setIsFieldEditing(false);
  };

  // Split the label to extract main prefix (Start/End)
  const labelPrefix = label.split(" ")[0]; // This will get "Start" or "End"

  if (!isEditing && !isFieldEditing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor={`${id}-date`}>{label}</Label>
        </div>
        <DateTimeReadOnlyField 
          dateValue={dateValue || ""} 
          timeValue={timeValue || ""} 
          handleFieldClick={handleFieldClick} 
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor={`${id}-date`}>{label}</Label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Input
            id={`${id}-date`}
            type="date"
            value={isFieldEditing ? tempDateValue : (dateValue || "")}
            onChange={(e) => isFieldEditing ? setTempDateValue(e.target.value) : onDateChange(e.target.value)}
            required
            className="rounded-r-none"
            min={minDate} // Apply minDate constraint
          />
        </div>
        <div className="relative">
          <div className="relative">
            <Input
              id={`${id}-time`}
              type="time"
              value={isFieldEditing ? tempTimeValue : (timeValue || "")}
              onChange={(e) => isFieldEditing ? setTempTimeValue(e.target.value) : onTimeChange(e.target.value)}
              required
              className="rounded-l-none border-l-0"
              min={tempDateValue === minDate ? minTime : undefined} // Only apply minTime when on same date
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
        </div>
      </div>
    </div>
  );
};
