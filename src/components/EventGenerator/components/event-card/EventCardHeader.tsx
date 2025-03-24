
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { CardHeader, CardDescription } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface EventCardHeaderProps {
  eventTitle: string;
  onTitleChange: (title: string) => void;
  displayDate: string;
  formatDate: (dateString: string) => string;
}

export const EventCardHeader: React.FC<EventCardHeaderProps> = ({
  eventTitle,
  onTitleChange,
  displayDate,
  formatDate
}) => {
  const [isTitleFocused, setIsTitleFocused] = useState(false);

  return (
    <CardHeader className="space-y-2">
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
        className={`text-xl font-semibold border-none px-0 focus-visible:ring-0 ${
          (eventTitle === 'Enter Event Name' && !isTitleFocused) ? 'text-gray-400 italic' : ''
        }`}
      />
      <CardDescription className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        {formatDate(displayDate)}
      </CardDescription>
    </CardHeader>
  );
};
