
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { FlexibleDatesCheckbox } from "./FlexibleDatesCheckbox";
import { FlexibleLocationCheckbox } from "./FlexibleLocationCheckbox";
import { DatePicker } from "./DatePicker";
import { MapPin, Calendar } from "lucide-react";

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
  const [isFlexibleDates, setIsFlexibleDates] = useState(false);
  const [isFlexibleLocation, setIsFlexibleLocation] = useState(false);
  
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      onDateChange(newDate.toISOString());
    }
  };

  const handleFlexibleDatesChange = (checked: boolean) => {
    setIsFlexibleDates(checked);
    if (checked) {
      onDateChange("Flexible");
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
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium">Event Date</span>
          </div>
          <DatePicker 
            date={!isFlexibleDates && date ? new Date(date) : undefined} 
            onDateChange={handleDateChange} 
            disabled={isFlexibleDates}
          />
          <FlexibleDatesCheckbox checked={isFlexibleDates} onChange={handleFlexibleDatesChange} />
        </div>
      )}

      {missingLocation && (
        <div className="space-y-2">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium">Event Location</span>
          </div>
          <Input
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder={isFlexibleLocation ? "Please select your preferred event locations (limit to 4 cities)" : "Enter event location"}
            className="w-full"
            disabled={!isFlexibleLocation}
          />
          <FlexibleLocationCheckbox checked={isFlexibleLocation} onChange={handleFlexibleLocationChange} />
        </div>
      )}
    </div>
  );
};
