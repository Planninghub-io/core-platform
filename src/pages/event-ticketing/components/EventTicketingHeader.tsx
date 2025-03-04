
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

interface EventTicketingHeaderProps {
  eventTitle: string;
  onBack: () => void;
  onAddTicket: () => void;
  hasTickets: boolean;
}

export const EventTicketingHeader: React.FC<EventTicketingHeaderProps> = ({
  eventTitle,
  onBack,
  onAddTicket,
  hasTickets
}) => {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 -ml-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{eventTitle} - Ticketing</h1>
        </div>
        
        {hasTickets && (
          <Button onClick={onAddTicket}>
            <Plus className="mr-2 h-4 w-4" />
            Add Ticket
          </Button>
        )}
      </div>
      <p className="text-muted-foreground">
        Create and manage tickets for your event. Set prices, quantities, and track sales.
      </p>
    </div>
  );
};
