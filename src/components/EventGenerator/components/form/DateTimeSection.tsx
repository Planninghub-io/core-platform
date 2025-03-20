
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Calendar, Clock } from "lucide-react";
import { DatePicker } from "../../DatePicker";
import { TimePicker } from "./TimePicker";
import { FlexibleDatesCheckbox } from "../../FlexibleDatesCheckbox";

interface DateTimeSectionProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  hasMissingDate: boolean;
}

export const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  selectedDate,
  setSelectedDate,
  hasMissingDate
}) => {
  const [isFlexibleDate, setIsFlexibleDate] = useState(selectedDate === "Flexible");
  const [dateValue, setDateValue] = useState<Date | undefined>(
    selectedDate && selectedDate !== "Flexible" ? new Date(selectedDate) : undefined
  );
  const [timeValue, setTimeValue] = useState<string>("12:00");
  
  const handleDateChange = (newDate: Date | undefined) => {
    setDateValue(newDate);
    if (newDate) {
      // Create a new date with the selected time
      const [hours, minutes] = timeValue.split(':').map(Number);
      const dateWithTime = new Date(newDate);
      dateWithTime.setHours(hours, minutes);
      
      // If flexible, still store the exact date in the state
      setSelectedDate(isFlexibleDate ? "Flexible" : dateWithTime.toISOString());
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTimeValue(newTime);
    if (dateValue) {
      // Update the date with the new time
      const [hours, minutes] = newTime.split(':').map(Number);
      const dateWithTime = new Date(dateValue);
      dateWithTime.setHours(hours, minutes);
      
      // If flexible, still store the exact date in the state
      setSelectedDate(isFlexibleDate ? "Flexible" : dateWithTime.toISOString());
    }
  };

  const handleFlexibleDateChange = (checked: boolean) => {
    setIsFlexibleDate(checked);
    if (checked) {
      setSelectedDate("Flexible");
    } else if (dateValue) {
      // If there's already a date selected, use that
      const [hours, minutes] = timeValue.split(':').map(Number);
      const dateWithTime = new Date(dateValue);
      dateWithTime.setHours(hours, minutes);
      setSelectedDate(dateWithTime.toISOString());
    } else {
      setSelectedDate("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Label htmlFor="date">Date & Time</Label>
        </div>
        
        <FlexibleDatesCheckbox 
          checked={isFlexibleDate} 
          onChange={handleFlexibleDateChange} 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <DatePicker 
            date={dateValue}
            onDateChange={handleDateChange}
          />
        </div>
        
        <div className="relative">
          <TimePicker
            value={timeValue}
            onChange={handleTimeChange}
          />
        </div>
      </div>
      
      {isFlexibleDate && (
        <p className="text-xs text-gray-500 italic">
          Date and time are flexible, but your selected options will be used for planning.
        </p>
      )}
      
      {hasMissingDate && !selectedDate && (
        <p className="text-sm text-red-500">Date is required</p>
      )}
    </div>
  );
};
