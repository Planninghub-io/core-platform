
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventFormReview } from "../EventFormReview";

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
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
