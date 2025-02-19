
import { Calendar, MapPin, User, Users, Pencil } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  endDate: string;
  location: string;
  imageUrl: string;
  category: string;
  createdBy: string;
  expectedAttendees?: number;
}

const EventCard = ({ 
  id,
  title, 
  date,
  endDate,
  location, 
  imageUrl, 
  category,
  createdBy,
  expectedAttendees 
}: EventCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy h:mm a");
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    navigate(`/event/${id}?edit=true`);
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
      onClick={() => navigate(`/event/${id}`)}
    >
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleEdit}
          className="p-2 bg-white/80 backdrop-blur rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
        >
          <Pencil className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className={`h-full w-full object-cover transition-all duration-700 ${
            isLoaded ? "scale-100 blur-0" : "scale-105 blur-sm"
          } group-hover:scale-110`}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {category}
          </span>
        </div>
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
    </div>
  );
};

export default EventCard;
