
import { Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const TimeSelector = ({ value, onChange }: TimeSelectorProps) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="w-full">
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
