
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Tag } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  onCreateEvent: () => void;
}

export const GeneratedEventCard = ({
  event,
  isCreating,
  onCreateEvent,
}: GeneratedEventCardProps) => {
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
      <CardFooter>
        <Button 
          onClick={onCreateEvent}
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? 'Creating Event...' : 'Create This Event'}
        </Button>
      </CardFooter>
    </Card>
  );
};
