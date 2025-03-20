
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Tag, Pencil, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { EditableEventFields } from "./EditableEventFields";

interface GeneratedEvent {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  estimatedPrice: string;
  imagePrompt: string;
  imageUrl?: string;
}

interface GeneratedEventCardProps {
  event: GeneratedEvent;
  isCreating: boolean;
  eventId?: string;
  imageUrl?: string;
  onCreateEvent: () => void;
  eventTitle: string;
  onTitleChange: (title: string) => void;
  onDateChange?: (date: string) => void;
  onLocationChange?: (location: string) => void;
  selectedDate?: string;
  missingDate?: boolean;
  missingLocation?: boolean;
}

export const GeneratedEventCard = ({
  event,
  isCreating,
  eventId,
  imageUrl,
  onCreateEvent,
  eventTitle,
  onTitleChange,
  onDateChange,
  onLocationChange,
  selectedDate,
  missingDate = false,
  missingLocation = false,
}: GeneratedEventCardProps) => {
  const navigate = useNavigate();
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [displayImageUrl, setDisplayImageUrl] = useState<string>('/placeholder.svg');
  
  // Auto-focus the title input if it's empty or a placeholder
  useEffect(() => {
    const isPlaceholder = eventTitle === 'Enter Event Name';
    if (isPlaceholder) {
      setTimeout(() => {
        const titleInput = document.querySelector('input[placeholder="Enter event title"]') as HTMLInputElement;
        if (titleInput) {
          titleInput.focus();
        }
      }, 500);
    }
  }, [eventTitle]);

  // Determine which image URL to use, with proper fallbacks
  useEffect(() => {
    // Priority: explicitly passed imageUrl > event.imageUrl > placeholder
    if (imageUrl) {
      setDisplayImageUrl(imageUrl);
      console.log("Using explicitly passed imageUrl:", imageUrl);
    } else if (event?.imageUrl) {
      setDisplayImageUrl(event.imageUrl);
      console.log("Using event.imageUrl:", event.imageUrl);
    } else {
      setDisplayImageUrl('/placeholder.svg');
      console.log("Using placeholder image");
    }
  }, [imageUrl, event]);

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

  const displayDate = selectedDate || event.date;

  return (
    <Card className="mt-6 text-left">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 p-4">
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src={displayImageUrl}
              alt={eventTitle || event.title || "Event"}
              className="w-full h-[200px] object-cover animate-fade-in rounded-lg transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                console.error("Image failed to load:", displayImageUrl);
                setDisplayImageUrl('/placeholder.svg');
              }}
            />
          </div>
        </div>
        <div className="flex-1 md:w-2/3">
          <CardHeader className="space-y-2">
            <Input
              value={eventTitle || event.title}
              onChange={(e) => onTitleChange(e.target.value)}
              onFocus={() => {
                setIsTitleFocused(true);
                if (eventTitle === 'Enter Event Name') {
                  onTitleChange('');
                }
              }}
              onBlur={() => {
                setIsTitleFocused(false);
                if (!eventTitle.trim()) {
                  onTitleChange('Enter Event Name');
                }
              }}
              placeholder="Enter event title"
              className={`text-xl font-semibold border-none px-0 focus-visible:ring-0 ${
                (eventTitle === 'Enter Event Name' && !isTitleFocused) ? 'text-gray-400 italic' : ''
              }`}
            />
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(displayDate)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            {/* Add editable fields for missing information */}
            {(missingDate || missingLocation) && (
              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <EditableEventFields 
                  eventTitle={eventTitle}
                  onTitleChange={onTitleChange}
                  date={selectedDate || event.date}
                  onDateChange={(date) => onDateChange && onDateChange(date)}
                  location={event.location}
                  onLocationChange={(location) => onLocationChange && onLocationChange(location)}
                  missingDate={missingDate}
                  missingLocation={missingLocation}
                />
              </div>
            )}
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
                disabled={isCreating || eventTitle === 'Enter Event Name' || !eventTitle.trim()}
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
