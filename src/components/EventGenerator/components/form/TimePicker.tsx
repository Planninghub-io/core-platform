
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  minTime?: string; // Add minTime prop for validation
}

export const TimePicker: React.FC<TimePickerProps> = ({ 
  value, 
  onChange,
  disabled = false,
  minTime
}) => {
  // Parse minTime to compare times
  const getMinHoursMinutes = () => {
    if (!minTime) return { hours: 0, minutes: 0 };
    const [hours, minutes] = minTime.split(':').map(Number);
    return { hours, minutes };
  };

  const { hours: minHours, minutes: minMinutes } = getMinHoursMinutes();
  
  // Helper to check if a time is before minTime
  const isTimeBefore = (timeStr: string) => {
    if (!minTime) return false;
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    if (hours < minHours) return true;
    if (hours === minHours && minutes < minMinutes) return true;
    
    return false;
  };

  // Generate time options in 30 minute increments
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hourStr = hour.toString().padStart(2, "0");
      const minStr = minute.toString().padStart(2, "0");
      const timeStr = `${hourStr}:${minStr}`;
      
      // Skip if before minTime
      if (minTime && isTimeBefore(timeStr)) {
        continue;
      }
      
      // Format for display (12-hour format)
      const ampm = hour < 12 ? "AM" : "PM";
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayTime = `${hour12}:${minStr} ${ampm}`;
      
      timeOptions.push({ value: timeStr, display: displayTime });
    }
  }

  return (
    <Select 
      value={value} 
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <Clock className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Select time" />
      </SelectTrigger>
      <SelectContent>
        {timeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.display}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
