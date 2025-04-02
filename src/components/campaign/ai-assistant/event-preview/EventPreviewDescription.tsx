
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface EventPreviewDescriptionProps {
  description: string;
  editMode: boolean;
  onFieldChange: (field: string, value: string) => void;
}

export const EventPreviewDescription: React.FC<EventPreviewDescriptionProps> = ({
  description,
  editMode,
  onFieldChange
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-1">Description</h3>
      {editMode ? (
        <Textarea
          value={description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          className="min-h-[100px]"
          placeholder="Event Description"
        />
      ) : (
        <p className="text-sm text-gray-600">{description}</p>
      )}
    </div>
  );
};
