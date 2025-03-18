
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { DatePicker } from "../../DatePicker";

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
  const [isFlexibleDate, setIsFlexibleDate] = useState(false);
  
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate.toISOString());
    }
  };

  const handleFlexibleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFlexibleDate(e.target.checked);
    if (e.target.checked) {
      setSelectedDate("Flexible");
    } else {
      setSelectedDate("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <Label htmlFor="date">Date & Time</Label>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <input 
          type="checkbox" 
          id="flexibleDate"
          checked={isFlexibleDate}
          onChange={handleFlexibleDateChange}
          className="h-4 w-4"
        />
        <Label htmlFor="flexibleDate" className="text-sm font-normal cursor-pointer">
          Date is flexible
        </Label>
      </div>
      
      {!isFlexibleDate && (
        <DatePicker 
          date={selectedDate ? new Date(selectedDate) : undefined}
          onDateChange={handleDateChange}
          disabled={isFlexibleDate}
        />
      )}
    </div>
  );
};
