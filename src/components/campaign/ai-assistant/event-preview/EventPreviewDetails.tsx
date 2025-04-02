
import React from 'react';
import { Input } from "@/components/ui/input";
import { MapPin, Tag, Users, Clock } from 'lucide-react';

interface EventPreviewDetailsProps {
  location?: string;
  category?: string;
  type?: string;
  expected_attendees?: string;
  end_date?: string;
  editMode: boolean;
  onFieldChange: (field: string, value: string) => void;
}

export const EventPreviewDetails: React.FC<EventPreviewDetailsProps> = ({
  location,
  category,
  type,
  expected_attendees,
  end_date,
  editMode,
  onFieldChange
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {/* Location field */}
        <div>
          <h3 className="text-sm font-medium mb-1 flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Location
          </h3>
          {editMode ? (
            <Input
              value={location || ''}
              onChange={(e) => onFieldChange('location', e.target.value)}
              placeholder="Event Location"
            />
          ) : (
            <p className="text-sm text-gray-600">{location || 'To be determined'}</p>
          )}
        </div>
        
        {/* Event Type/Category field */}
        <div>
          <h3 className="text-sm font-medium mb-1 flex items-center gap-1">
            <Tag className="h-4 w-4" />
            Event Type
          </h3>
          {editMode ? (
            <Input
              value={category || type || ''}
              onChange={(e) => onFieldChange('category', e.target.value)}
              placeholder="Event Category"
            />
          ) : (
            <p className="text-sm text-gray-600">{type || category || 'General'}</p>
          )}
        </div>
      </div>
      
      {/* Additional details row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Expected Attendees field */}
        <div>
          <h3 className="text-sm font-medium mb-1 flex items-center gap-1">
            <Users className="h-4 w-4" />
            Expected Attendees
          </h3>
          {editMode ? (
            <Input
              value={expected_attendees || ''}
              onChange={(e) => onFieldChange('expected_attendees', e.target.value)}
              placeholder="Number of Attendees"
              type="number"
            />
          ) : (
            <p className="text-sm text-gray-600">{expected_attendees || 'Not specified'}</p>
          )}
        </div>
        
        {/* End Date/Duration field */}
        <div>
          <h3 className="text-sm font-medium mb-1 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            End Date
          </h3>
          {editMode ? (
            <Input
              type="datetime-local"
              value={end_date || ''}
              onChange={(e) => onFieldChange('end_date', e.target.value)}
              placeholder="End Date & Time"
            />
          ) : (
            <p className="text-sm text-gray-600">{end_date || 'Not specified'}</p>
          )}
        </div>
      </div>
    </>
  );
};
