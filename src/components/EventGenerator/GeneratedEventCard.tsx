
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Tag, Pencil } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface GeneratedEvent {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  estimatedPrice: string;
  imagePrompt: string;
}

interface GeneratedEventCardProps {
  event: GeneratedEvent;
  isCreating: boolean;
  eventId?: string;
  imageUrl?: string;
  onCreateEvent: () => void;
}

export const GeneratedEventCard = ({
  event,
  isCreating,
  eventId,
  imageUrl,
  onCreateEvent,
}: GeneratedEventCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    try {
      // Handle "flexible" date case
      if (dateString === "flexible") {
        return "Flexible Date & Time";
      }

      // First try to parse the date directly
      let date = new Date(dateString);
      
      // If the date is invalid, check if it's a datetime string
      if (isNaN(date.getTime()) && dateString.includes('T')) {
        // Try to parse ISO format
        date = new Date(dateString);
      }

      // If we still have an invalid date, return placeholder
      if (isNaN(date.getTime())) {
        return "Date to be determined";
      }

      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "Date to be determined";
    }
  };

  return (
    <Card className="mt-6 text-left">
      <div className="flex flex-col md:flex-row">
        {imageUrl && (
          <div className="w-full md:w-1/3 p-4">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={imageUrl}
                alt={event.title}
                className="w-full h-[200px] object-cover animate-fade-in rounded-lg transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        )}
        <div className={`flex-1 ${imageUrl ? 'md:w-2/3' : 'w-full'}`}>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(event.date)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{event.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                {event.category}
              </span>
              <span>Starting from {event.estimatedPrice}</span>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            {eventId ? (
              <Button 
                onClick={() => navigate(`/event/${eventId}/edit`)}
                className="flex-1 gap-2"
                variant="outline"
              >
                <Pencil className="h-4 w-4" />
                Edit Event
              </Button>
            ) : (
              <Button 
                onClick={onCreateEvent}
                disabled={isCreating}
                className="flex-1"
              >
                {isCreating ? 'Creating Event...' : 'Create This Event'}
              </Button>
            )}
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};
