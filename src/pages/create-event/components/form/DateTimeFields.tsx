
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DateSelector } from "./DateSelector";
import { TimeSelector } from "./TimeSelector";
import { getTimezoneShort } from "../../utils/timezoneUtils";

interface DateTimeFieldsProps {
  date: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  isFlexibleDate: boolean;
  handleDateChange: (field: string, value: Date) => void;
  handleTimeChange: (field: string, value: string) => void;
  handleCheckboxChange: (field: string, checked: boolean) => void;
  handleSelectChange: (field: string, value: string) => void;
}

export const DateTimeFields = ({
  date,
  endDate,
  startTime,
  endTime,
  timezone,
  isFlexibleDate,
  handleDateChange,
  handleTimeChange,
  handleCheckboxChange,
  handleSelectChange
}: DateTimeFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Event Date & Time *</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="flexibleDate"
            checked={isFlexibleDate}
            onCheckedChange={(checked) => handleCheckboxChange('isFlexibleDate', checked === true)}
          />
          <Label htmlFor="flexibleDate" className="cursor-pointer text-sm">Is flexible</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm">Start Date</Label>
          <DateSelector
            id="startDate"
            value={date}
            onChange={(value) => handleDateChange('date', value)}
            placeholder="Select start date"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm">End Date</Label>
          <DateSelector
            id="endDate"
            value={endDate}
            onChange={(value) => handleDateChange('endDate', value)}
            placeholder="Select end date"
            minDate={date}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime" className="text-sm">Start Time</Label>
          <TimeSelector
            id="startTime"
            value={startTime}
            onChange={(value) => handleTimeChange('startTime', value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime" className="text-sm">End Time</Label>
          <TimeSelector
            id="endTime"
            value={endTime}
            onChange={(value) => handleTimeChange('endTime', value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Time Zone</Label>
          <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
            {getTimezoneShort(timezone)} (Auto-detected)
          </div>
        </div>
      </div>
    </div>
  );
};
