
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";

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
  eventTitle: string;
  onTitleChange: (title: string) => void;
}

export const GeneratedEventCard = ({
  event,
  isCreating,
  eventId,
  imageUrl,
  onCreateEvent,
  eventTitle,
  onTitleChange,
}: GeneratedEventCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    try {
      if (dateString.toLowerCase() === "flexible") {
        return "Flexible Date & Time";
      }

      const date = new Date(dateString);
      
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        });
      }

      return dateString || "Date to be determined";
    } catch (error) {
      console.error('Error formatting date:', error);
      return "Date to be determined";
    }
  };

  return (
    <Card className="mt-6 text-left">
      <div className="flex flex-col md:flex-row">
        {event.imagePrompt && (
          <div className="w-full md:w-1/3 p-4">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={imageUrl || "/placeholder.svg"}
                alt={eventTitle || "Event"}
                className="w-full h-[200px] object-cover animate-fade-in rounded-lg transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        )}
        <div className={`flex-1 ${event.imagePrompt ? 'md:w-2/3' : 'w-full'}`}>
          <CardHeader>
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={eventTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Enter event title"
                className="text-lg font-semibold"
              />
            </div>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4" />
              {formatDate(event.date)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{event.description || 'No description available'}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {event.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </span>
              )}
              {event.category && (
                <span className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {event.category}
                </span>
              )}
              {event.estimatedPrice && (
                <span>Starting from {event.estimatedPrice}</span>
              )}
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
