
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { DateTimeReadOnlyField } from "./DateTimeReadOnlyField";
import { EditableDateTimeField } from "./EditableDateTimeField";

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
  
  // Update local state when props change
  useEffect(() => {
    setTempDateValue(dateValue);
    setTempTimeValue(timeValue);
  }, [dateValue, timeValue]);
  
  const handleFieldClick = () => {
    if (showEditButton && onEditClick) {
      onEditClick();
      setIsFieldEditing(true);
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

  const handleDateChange = (value: string) => {
    if (isFieldEditing) {
      setTempDateValue(value);
    } else {
      onDateChange(value);
    }
  };

  const handleTimeChange = (value: string) => {
    if (isFieldEditing) {
      setTempTimeValue(value);
    } else {
      onTimeChange(value);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor={`${id}-date`}>{label}</Label>
      </div>
      
      {(isEditing || isFieldEditing) ? (
        <EditableDateTimeField
          id={id}
          dateValue={dateValue}
          timeValue={timeValue}
          tempDateValue={tempDateValue}
          tempTimeValue={tempTimeValue}
          isFieldEditing={isFieldEditing}
          onDateChange={handleDateChange}
          onTimeChange={handleTimeChange}
          onSave={isFieldEditing ? handleSaveField : undefined}
          onCancel={isFieldEditing ? handleCancelField : undefined}
        />
      ) : (
        <DateTimeReadOnlyField
          dateValue={dateValue}
          timeValue={timeValue}
          handleFieldClick={handleFieldClick}
        />
      )}
    </div>
  );
};
