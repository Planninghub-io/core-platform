
import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  // Generate time options in 30-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const isPM = hour >= 12;
        const displayHour = hour % 12 || 12;
        const displayMinute = minute.toString().padStart(2, '0');
        const displayTime = `${displayHour}:${displayMinute} ${isPM ? 'PM' : 'AM'}`;
        const value = `${hour}:${displayMinute}`;
        
        options.push({ label: displayTime, value });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="relative">
      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 z-10" />
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="pl-10 h-10">
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent>
          {timeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
