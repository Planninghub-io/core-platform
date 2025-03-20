
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { FlexibleDatesCheckbox } from "./FlexibleDatesCheckbox";
import { FlexibleLocationCheckbox } from "./FlexibleLocationCheckbox";
import { DatePicker } from "./DatePicker";
import { MapPin, Calendar, Clock } from "lucide-react";
import { TimePicker } from "./components/form/TimePicker";

interface EditableEventFieldsProps {
  eventTitle: string;
  onTitleChange: (title: string) => void;
  date: string;
  onDateChange: (date: string) => void;
  location: string;
  onLocationChange: (location: string) => void;
  missingDate: boolean;
  missingLocation: boolean;
}

export const EditableEventFields: React.FC<EditableEventFieldsProps> = ({
  eventTitle,
  onTitleChange,
  date,
  onDateChange,
  location,
  onLocationChange,
  missingDate,
  missingLocation
}) => {
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isFlexibleDates, setIsFlexibleDates] = useState(date === "Flexible");
  const [isFlexibleLocation, setIsFlexibleLocation] = useState(false);
  const [dateValue, setDateValue] = useState<Date | undefined>(
    date && date !== "Flexible" ? new Date(date) : undefined
  );
  const [timeValue, setTimeValue] = useState<string>("12:00");
  
  const handleDateChange = (newDate: Date | undefined) => {
    setDateValue(newDate);
    if (newDate) {
      // Create a new date with the selected time
      const [hours, minutes] = timeValue.split(':').map(Number);
      const dateWithTime = new Date(newDate);
      dateWithTime.setHours(hours, minutes);
      onDateChange(dateWithTime.toISOString());
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTimeValue(newTime);
    if (dateValue) {
      // Update the date with the new time
      const [hours, minutes] = newTime.split(':').map(Number);
      const dateWithTime = new Date(dateValue);
      dateWithTime.setHours(hours, minutes);
      onDateChange(dateWithTime.toISOString());
    }
  };

  const handleFlexibleDatesChange = (checked: boolean) => {
    setIsFlexibleDates(checked);
    if (checked) {
      onDateChange("Flexible");
    } else if (dateValue) {
      // If there's already a date selected, use that
      const [hours, minutes] = timeValue.split(':').map(Number);
      const dateWithTime = new Date(dateValue);
      dateWithTime.setHours(hours, minutes);
      onDateChange(dateWithTime.toISOString());
    } else {
      onDateChange("");
    }
  };

  const handleFlexibleLocationChange = (checked: boolean) => {
    setIsFlexibleLocation(checked);
  };

  return (
    <div className="space-y-4">
      <div>
        <Input
          value={eventTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          onFocus={() => {
            setIsTitleFocused(true);
            if (eventTitle === 'Enter Event Name') {
              onTitleChange('');
            }
          }}
          onBlur={() => {
            setIsTitleFocused(false);
            if (!eventTitle.trim()) {
              onTitleChange('Enter Event Name');
            }
          }}
          placeholder="Enter event title"
          className={`text-xl font-semibold border px-3 py-2 focus-visible:ring-1 ${
            (eventTitle === 'Enter Event Name' && !isTitleFocused) ? 'text-gray-400 italic' : ''
          }`}
        />
      </div>

      {missingDate && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium">Event Date & Time</span>
            </div>
            <FlexibleDatesCheckbox checked={isFlexibleDates} onChange={handleFlexibleDatesChange} />
          </div>
          
          {!isFlexibleDates && (
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <DatePicker 
                  date={dateValue} 
                  onDateChange={handleDateChange} 
                  disabled={isFlexibleDates}
                />
              </div>
              
              <div className="relative">
                <TimePicker
                  value={timeValue}
                  onChange={handleTimeChange}
                  disabled={isFlexibleDates}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {missingLocation && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium">Event Location</span>
            </div>
            <FlexibleLocationCheckbox checked={isFlexibleLocation} onChange={handleFlexibleLocationChange} />
          </div>
          
          <Input
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder={isFlexibleLocation ? "Please select your preferred event locations" : "Enter event location"}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
