
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";

interface EditableDateTimeFieldProps {
  id: string;
  dateValue: string;
  timeValue: string;
  isFieldEditing: boolean;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  tempDateValue?: string;
  tempTimeValue?: string;
  minDate?: string; // Add minDate constraint
  minTime?: string; // Add minTime constraint
}

export const EditableDateTimeField = ({
  id,
  dateValue,
  timeValue,
  isFieldEditing,
  onDateChange,
  onTimeChange,
  onSave,
  onCancel,
  tempDateValue,
  tempTimeValue,
  minDate,
  minTime
}: EditableDateTimeFieldProps) => {
  const displayDateValue = isFieldEditing && tempDateValue !== undefined
    ? tempDateValue
    : dateValue;
    
  const displayTimeValue = isFieldEditing && tempTimeValue !== undefined
    ? tempTimeValue
    : timeValue;
  
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Input
          id={`${id}-date`}
          type="date"
          value={displayDateValue}
          onChange={(e) => onDateChange(e.target.value)}
          required
          className="rounded-r-none"
          min={minDate} // Apply minDate constraint
        />
      </div>
      <div className="relative">
        <Input
          id={`${id}-time`}
          type="time"
          value={displayTimeValue}
          onChange={(e) => onTimeChange(e.target.value)}
          required
          className="rounded-l-none border-l-0"
          min={displayDateValue === minDate ? minTime : undefined} // Only apply minTime when on same date
        />
        {isFieldEditing && onSave && onCancel && (
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
    </div>
  );
};
