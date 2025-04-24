
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventFormReview } from "../EventFormReview";
import { toast } from "sonner";
import { useEffect } from "react";

interface EventReviewDialogProps {
  open: boolean;
  generatedEvent: any;
  eventTitle: string;
  setEventTitle: (title: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const EventReviewDialog = ({
  open,
  generatedEvent,
  eventTitle,
  setEventTitle,
  onClose,
  onSubmit
}: EventReviewDialogProps) => {
  // Debug logging
  useEffect(() => {
    console.log("EventReviewDialog rendered with:", { 
      open, 
      hasGeneratedEvent: !!generatedEvent,
      eventTitle
    });
  }, [open, generatedEvent, eventTitle]);

  // Validate before submission
  const handleSubmit = () => {
    if (!eventTitle || !eventTitle.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    console.log("Submitting event with title:", eventTitle);
    onSubmit();
  };

  // Dialog should only be open when both conditions are met
  const shouldShowDialog = open && !!generatedEvent;

  return (
    <Dialog 
      open={shouldShowDialog}
      onOpenChange={(visible) => {
        console.log("Dialog visibility changing to:", visible);
        if (!visible) onClose();
      }}
    >
      <DialogContent 
        className="sm:max-w-2xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {generatedEvent && (
          <EventFormReview
            event={generatedEvent}
            eventTitle={eventTitle}
            setEventTitle={setEventTitle}
            onClose={onClose}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
