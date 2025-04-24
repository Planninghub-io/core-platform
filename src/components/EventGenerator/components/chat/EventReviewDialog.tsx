
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventFormReview } from "../EventFormReview";
import { toast } from "sonner";

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
  // Validate before submission
  const handleSubmit = () => {
    if (!eventTitle || !eventTitle.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    onSubmit();
  };

  return (
    <Dialog 
      open={open && !!generatedEvent} 
      onOpenChange={(visible) => {
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
