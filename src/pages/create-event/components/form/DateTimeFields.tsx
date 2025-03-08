
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DateSelector } from "./DateSelector";
import { TimeSelector } from "./TimeSelector";
import { TimezoneSelector } from "./TimezoneSelector";

interface DateTimeFieldsProps {
  date: string | Date;
  endDate: string | Date;
  startTime: string;
  endTime: string;
  timezone: string;
  isFlexibleDate: boolean;
  handleDateChange: (field: string, value: Date) => void;
  handleTimeChange: (field: string, value: string) => void;
  handleCheckboxChange: (field: string, checked: boolean) => void;
  handleSelectChange: (field: string, value: any) => void;
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
  handleSelectChange,
}: DateTimeFieldsProps) => {
  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Start Date & Time *</Label>
            <div className="grid grid-cols-2 gap-2">
              <DateSelector 
                date={date}
                onSelect={(selectedDate) => handleDateChange('date', selectedDate)}
              />
              
              <TimeSelector 
                value={startTime}
                onChange={(value) => handleTimeChange('startTime', value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date & Time *</Label>
            <div className="grid grid-cols-2 gap-2">
              <DateSelector 
                date={endDate}
                onSelect={(selectedDate) => handleDateChange('endDate', selectedDate)}
                disabled={(date) => {
                  // Disable dates before the start date
                  if (!date) return false;
                  const startDate = new Date(date);
                  startDate.setHours(0, 0, 0, 0);
                  return date < startDate;
                }}
              />
              
              <TimeSelector 
                value={endTime}
                onChange={(value) => handleTimeChange('endTime', value)}
              />
            </div>
          </div>
        </div>
        
        {/* Dates are flexible checkbox and Timezone in the same row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="flexibleDate" 
              checked={isFlexibleDate}
              onCheckedChange={(checked) => handleCheckboxChange('isFlexibleDate', checked === true)}
            />
            <Label htmlFor="flexibleDate" className="cursor-pointer">Dates are flexible</Label>
          </div>
          
          <TimezoneSelector 
            timezone={timezone}
            onChange={(value) => handleSelectChange('timezone', value)}
          />
        </div>
      </div>
    </>
  );
};
