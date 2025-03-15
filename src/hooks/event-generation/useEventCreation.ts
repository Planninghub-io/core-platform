
import { useToast } from "@/hooks/use-toast";
import { GeneratedEvent } from "./types";
import { useNavigate } from "react-router-dom";

export const useEventCreationHandler = (
  generatedEvent: GeneratedEvent | null,
  eventTitle: string,
  hasMissingDate: boolean,
  selectedDate: string,
  hasMissingLocation: boolean,
  location: string,
  additionalInfo: Record<string, string>,
  createEvent: (eventData: any) => Promise<{ eventId: string | null }>
) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateEvent = async () => {
    if (!generatedEvent) {
      toast({
        title: "Error",
        description: "No event details to create",
        variant: "destructive",
      });
      return;
    }

    if (hasMissingDate || hasMissingLocation) {
      toast({
        title: "Missing Information",
        description: `Please provide ${hasMissingDate ? 'date' : ''}${hasMissingDate && hasMissingLocation ? ' and ' : ''}${hasMissingLocation ? 'location' : ''}`,
        variant: "destructive",
      });
      return;
    }

    // Create event data
    const eventData = {
      title: eventTitle || generatedEvent.title,
      description: generatedEvent.description,
      date: selectedDate || generatedEvent.date,
      location: location || generatedEvent.location,
      category: generatedEvent.category,
      estimatedPrice: generatedEvent.estimatedPrice,
      imagePrompt: generatedEvent.imagePrompt
    };

    const { eventId } = await createEvent(eventData);
    
    if (eventId) {
      navigate(`/events-hub?created=${eventId}`);
    }
  };

  return { handleCreateEvent };
};
