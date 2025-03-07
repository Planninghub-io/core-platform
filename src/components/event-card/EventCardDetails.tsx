
import React from "react";
import { Calendar, MapPin, User, Users } from "lucide-react";
import { format } from "date-fns";

interface EventCardDetailsProps {
  title: string;
  date: string;
  endDate: string;
  location: string;
  category: string;
  createdBy: string;
  expectedAttendees?: number;
}

const EventCardDetails: React.FC<EventCardDetailsProps> = ({
  title,
  date,
  endDate,
  location,
  category,
  createdBy,
  expectedAttendees,
}) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy h:mm a");
  };

  return (
    <div className="p-6">
      <EventCardCategory category={category} />
      <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-primary">
        {title}
      </h3>
      <div className="space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Starts: {formatDateTime(date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Ends: {formatDateTime(endDate)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{createdBy}</span>
        </div>
        {expectedAttendees && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{expectedAttendees} expected</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Import within the same file to avoid circular dependency
const EventCardCategory: React.FC<{category: string}> = ({ category }) => {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        {category}
      </span>
    </div>
  );
};

export default EventCardDetails;
