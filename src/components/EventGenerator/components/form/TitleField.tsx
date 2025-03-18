
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface TitleFieldProps {
  eventTitle: string;
  setEventTitle: (title: string) => void;
}

export const TitleField: React.FC<TitleFieldProps> = ({ 
  eventTitle, 
  setEventTitle 
}) => {
  const [isTitleFocused, setIsTitleFocused] = useState(false);

  return (
    <Input
      value={eventTitle}
      onChange={(e) => setEventTitle(e.target.value)}
      onFocus={() => {
        setIsTitleFocused(true);
        if (eventTitle === 'Enter Event Name') {
          setEventTitle('');
        }
      }}
      onBlur={() => {
        setIsTitleFocused(false);
        if (!eventTitle.trim()) {
          setEventTitle('Enter Event Name');
        }
      }}
      placeholder="Enter event title"
      className={`text-xl font-semibold ${
        (eventTitle === 'Enter Event Name' && !isTitleFocused) ? 'text-gray-400 italic' : ''
      }`}
    />
  );
};
