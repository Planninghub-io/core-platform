
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
  onCreateEvent: () => void;
}

export const GeneratedEventCard = ({
  event,
  isCreating,
  eventId,
  onCreateEvent,
}: GeneratedEventCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="mt-6 text-left">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
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
    </Card>
  );
};
