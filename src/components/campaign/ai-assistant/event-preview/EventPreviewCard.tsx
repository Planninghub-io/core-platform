
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface EventPreviewHeaderProps {
  title: string;
  date?: string;
  editMode: boolean;
  onTitleChange: (value: string) => void;
}

export const EventPreviewCard: React.FC<EventPreviewHeaderProps> = ({
  title,
  date,
  editMode,
  onTitleChange
}) => {
  return (
    <CardHeader>
      {editMode ? (
        <Input
          value={title}
          onChange={(e) => onTitleChange('title', e.target.value)}
          className="text-xl font-semibold mb-1"
          placeholder="Event Title"
        />
      ) : (
        <CardTitle className="text-xl">{title}</CardTitle>
      )}
      
      {date && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {editMode ? (
            <Input
              type="datetime-local"
              value={date}
              onChange={(e) => onTitleChange('date', e.target.value)}
              className="text-sm"
            />
          ) : (
            <CardDescription>{date}</CardDescription>
          )}
        </div>
      )}
    </CardHeader>
  );
};
