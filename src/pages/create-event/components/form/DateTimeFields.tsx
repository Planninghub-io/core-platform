
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DateSelector } from "./DateSelector";
import { TimeSelector } from "./TimeSelector";
import { TimezoneSelector } from "./TimezoneSelector";
import { useEffect } from "react";

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
  // Ensure end date/time is always after start date/time
  useEffect(() => {
    if (date && startTime) {
      const startDateTime = new Date(date);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      startDateTime.setHours(startHours, startMinutes, 0, 0);
      
      // If end date exists
      if (endDate) {
        const endDateTime = new Date(endDate);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        endDateTime.setHours(endHours, endMinutes, 0, 0);
        
        // If end date/time is before or equal to start date/time
        if (endDateTime <= startDateTime) {
          // Set end date to start date and end time to 2 hours after start time
          const newEndDateTime = new Date(startDateTime);
          newEndDateTime.setHours(startDateTime.getHours() + 2);
          
          // Update end date and end time
          handleDateChange('endDate', newEndDateTime);
          
          const newEndHours = newEndDateTime.getHours().toString().padStart(2, '0');
          const newEndMinutes = newEndDateTime.getMinutes().toString().padStart(2, '0');
          handleTimeChange('endTime', `${newEndHours}:${newEndMinutes}`);
        }
      } else if (date) {
        // If no end date is set yet, default to same date as start + 2 hours
        const newEndDateTime = new Date(date);
        const [hours, minutes] = startTime.split(':').map(Number);
        newEndDateTime.setHours(hours + 2, minutes, 0, 0);
        
        handleDateChange('endDate', newEndDateTime);
        
        const newEndHours = newEndDateTime.getHours().toString().padStart(2, '0');
        const newEndMinutes = newEndDateTime.getMinutes().toString().padStart(2, '0');
        handleTimeChange('endTime', `${newEndHours}:${newEndMinutes}`);
      }
    }
  }, [date, startTime, handleDateChange, handleTimeChange]);

  // Function to create date disabling logic for end date picker
  const createEndDateDisabledFn = () => {
    return (currentDate: Date) => {
      if (!date) return false;
      
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const compareDate = new Date(currentDate);
      compareDate.setHours(0, 0, 0, 0);
      
      return compareDate < startDate;
    };
  };

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
                disabled={createEndDateDisabledFn()}
              />
              
              <TimeSelector 
                value={endTime}
                onChange={(value) => handleTimeChange('endTime', value)}
                minTime={date && endDate && sameDay(new Date(date), new Date(endDate)) ? startTime : undefined}
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

// Helper function to check if two dates are on the same day
const sameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
