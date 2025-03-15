
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useEventCreationHandler = (
  generatedEvent: any,
  eventTitle: string,
  hasMissingDate: boolean,
  selectedDate: string,
  hasMissingLocation: boolean,
  location: string,
  additionalInfo: Record<string, string>,
  createEvent: (event: any, additionalInfo: Record<string, string>) => Promise<any>
) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateEvent = async () => {
    if (!generatedEvent) {
      toast({
        title: "Error",
        description: "No event details available. Please generate an event first.",
        variant: "destructive",
      });
      return;
    }

    // Check if we have a title
    if (!eventTitle.trim() || eventTitle === 'Enter Event Name') {
      toast({
        title: "Error",
        description: "Please provide a title for your event.",
        variant: "destructive",
      });
      return;
    }

    // Check if date is required but missing
    if (hasMissingDate && !selectedDate) {
      toast({
        title: "Error",
        description: "Please provide a date for your event.",
        variant: "destructive",
      });
      return;
    }

    // Check if location is required but missing
    if (hasMissingLocation && !location) {
      toast({
        title: "Error",
        description: "Please provide a location for your event.",
        variant: "destructive",
      });
      return;
    }

    // Use the user-provided or AI-generated title, date, and location
    const eventWithUpdates = {
      ...generatedEvent,
      title: eventTitle.trim(),
      date: selectedDate || generatedEvent.date,
      location: location || generatedEvent.location,
    };

    const { error, requiresAuth } = await createEvent(eventWithUpdates, additionalInfo);

    // If auth is required, the dialog will be shown by useEventCreation
    if (requiresAuth) {
      return;
    }

    if (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create event. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Event created successfully.",
    });

    navigate("/events-hub");
  };

  return { handleCreateEvent };
};
