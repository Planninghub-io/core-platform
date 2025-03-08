
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TIMEZONES, getTimezoneShort } from "../../utils/timezoneUtils";

interface TimezoneSelectorProps {
  timezone: string;
  onChange: (value: string) => void;
}

export const TimezoneSelector = ({ timezone, onChange }: TimezoneSelectorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="timezone" className="whitespace-nowrap">Time Zone:</Label>
      <Select
        value={timezone}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select timezone">
            {getTimezoneShort(timezone)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {TIMEZONES.map((tz) => (
            <SelectItem key={tz.value} value={tz.value}>
              {tz.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
