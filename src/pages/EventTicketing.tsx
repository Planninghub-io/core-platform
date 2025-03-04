
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EventTicketingHeader } from "./event-ticketing/components/EventTicketingHeader";
import { TicketsList } from "./event-ticketing/components/TicketsList";
import { NoTicketsView } from "./event-ticketing/components/NoTicketsView";
import { LoadingState } from "./event-ticketing/components/LoadingState";
import { EventNotFound } from "./event-ticketing/components/EventNotFound";
import { TicketFormManager } from "./event-ticketing/components/TicketFormManager";
import { useTickets } from "./event-ticketing/hooks/useTickets";
import { useEventDetails } from "./event-ticketing/hooks/useEventDetails";

const EventTicketing: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use our custom hooks
  const { event, loading: eventLoading } = useEventDetails(eventId);
  const { 
    tickets, 
    loading: ticketsLoading, 
    addTicket, 
    deleteTicket, 
    updateTicket 
  } = useTickets(eventId);

  const handleBack = () => {
    navigate(`/event/${eventId}`);
  };

  // Show loading state if either data is still loading
  if (eventLoading || ticketsLoading) {
    return <LoadingState />;
  }

  // Show not found state if event doesn't exist
  if (!event) {
    return <EventNotFound />;
  }

  return (
    <div className="container py-8">
      <TicketFormManager onAddTicket={addTicket}>
        {(showAddForm, setShowAddForm) => (
          <>
            <EventTicketingHeader 
              eventTitle={event.title} 
              onBack={handleBack}
              onAddTicket={() => setShowAddForm(true)}
              hasTickets={tickets.length > 0}
            />

            {tickets.length > 0 ? (
              <TicketsList 
                tickets={tickets} 
                onDelete={deleteTicket}
                onUpdate={updateTicket}
              />
            ) : (
              !showAddForm && <NoTicketsView onAddTicket={() => setShowAddForm(true)} />
            )}
          </>
        )}
      </TicketFormManager>
    </div>
  );
};

export default EventTicketing;
