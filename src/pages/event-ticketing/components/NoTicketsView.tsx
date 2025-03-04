
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

interface NoTicketsViewProps {
  onAddTicket: () => void;
}

export const NoTicketsView: React.FC<NoTicketsViewProps> = ({ onAddTicket }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-muted/20 rounded-lg border border-dashed">
      <Ticket className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">No Tickets Available</h2>
      <p className="text-muted-foreground mb-6 max-w-md text-center">
        You haven't created any tickets for this event yet. Add tickets to start selling or distributing them to your attendees.
      </p>
      <Button onClick={onAddTicket}>
        Create Your First Ticket
      </Button>
    </div>
  );
};
