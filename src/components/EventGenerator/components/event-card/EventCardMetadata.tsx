
import React from "react";
import { MapPin, Tag, Calendar } from "lucide-react";
import { formatEventDate } from "../../utils/dateFormatter";

interface EventCardMetadataProps {
  location?: string;
  category?: string;
  estimatedPrice?: string;
  date?: string;
}

export const EventCardMetadata: React.FC<EventCardMetadataProps> = ({
  location,
  category,
  estimatedPrice,
  date
}) => {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
      {date && (
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {formatEventDate(date)}
        </span>
      )}
      {location && (
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {location}
        </span>
      )}
      {category && (
        <span className="flex items-center gap-1">
          <Tag className="h-4 w-4" />
          {category}
        </span>
      )}
      {estimatedPrice && (
        <span>Starting from {estimatedPrice}</span>
      )}
    </div>
  );
};
