
import { Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeSelectorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  minTime?: string; // Add minTime prop for validation
}

export const TimeSelector = ({ id, value, onChange, minTime }: TimeSelectorProps) => {
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

  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger id={id} className="w-full">
        <Clock className="h-4 w-4 mr-1 opacity-70" />
        <SelectValue placeholder="Time" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 24 }).map((_, hour) => (
          Array.from({ length: 4 }).map((_, minuteIdx) => {
            const minute = minuteIdx * 15;
            const hourStr = hour.toString().padStart(2, '0');
            const minuteStr = minute.toString().padStart(2, '0');
            const timeValue = `${hourStr}:${minuteStr}`;
            const ampm = hour < 12 ? 'AM' : 'PM';
            const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            const displayTime = `${hour12}:${minuteStr} ${ampm}`;
            
            // Skip rendering this time option if it's before minTime
            if (minTime && isTimeBefore(timeValue)) {
              return null;
            }
            
            return (
              <SelectItem key={timeValue} value={timeValue}>
                {displayTime}
              </SelectItem>
            );
          })
        ))}
      </SelectContent>
    </Select>
  );
};
