
import React, { useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { EventTicketingHeader } from "./event-ticketing/components/EventTicketingHeader";
import { TicketsList } from "./event-ticketing/components/TicketsList";
import { NoTicketsView } from "./event-ticketing/components/NoTicketsView";
import { LoadingState } from "./event-ticketing/components/LoadingState";
import { EventNotFound } from "./event-ticketing/components/EventNotFound";
import { TicketFormManager } from "./event-ticketing/components/TicketFormManager";
import { PaymentAccountAlert } from "./event-ticketing/components/PaymentAccountAlert";
import { useTickets } from "./event-ticketing/hooks/useTickets";
import { useEventDetails } from "./event-ticketing/hooks/useEventDetails";
import { useStripeAccount } from "./event-ticketing/hooks/useStripeAccount";
import { useToast } from "@/hooks/use-toast";

const EventTicketing: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Use our custom hooks
  const { event, loading: eventLoading } = useEventDetails(eventId);
  const { 
    tickets, 
    loading: ticketsLoading, 
    addTicket, 
    deleteTicket, 
    updateTicket 
  } = useTickets(eventId);
  const {
    hasStripeAccount,
    loading: stripeLoading,
    connectStripeAccount,
    checkStripeAccount
  } = useStripeAccount();

  // Check for Stripe connection success/error params
  useEffect(() => {
    const stripeSuccess = searchParams.get('stripe_success');
    const stripeError = searchParams.get('stripe_error');
    
    if (stripeSuccess) {
      toast({
        title: "Payment Account Connected",
        description: "Your payment account was successfully connected.",
      });
      checkStripeAccount(); // Refresh status
    } else if (stripeError) {
      toast({
        title: "Connection Failed",
        description: decodeURIComponent(stripeError),
        variant: "destructive",
      });
    }
  }, [searchParams, toast, checkStripeAccount]);

  const handleBack = () => {
    navigate(`/event/${eventId}`);
  };

  // Show loading state if any data is still loading
  if (eventLoading || ticketsLoading || stripeLoading) {
    return <LoadingState />;
  }

  // Show not found state if event doesn't exist
  if (!event) {
    return <EventNotFound />;
  }

  return (
    <div className="container py-8">
      {!hasStripeAccount && (
        <PaymentAccountAlert onSetupAccount={connectStripeAccount} />
      )}
      
      <TicketFormManager 
        onAddTicket={addTicket}
        disableAddTicket={!hasStripeAccount}
      >
        {(showAddForm, setShowAddForm) => (
          <>
            <EventTicketingHeader 
              eventTitle={event.title} 
              onBack={handleBack}
              onAddTicket={() => {
                if (!hasStripeAccount) {
                  toast({
                    title: "Payment Account Required",
                    description: "You need to set up a payment account before adding tickets.",
                    variant: "destructive",
                  });
                  return;
                }
                setShowAddForm(true);
              }}
              hasTickets={tickets.length > 0}
            />

            {tickets.length > 0 ? (
              <TicketsList 
                tickets={tickets} 
                onDelete={deleteTicket}
                onUpdate={updateTicket}
              />
            ) : (
              !showAddForm && <NoTicketsView onAddTicket={() => {
                if (!hasStripeAccount) {
                  toast({
                    title: "Payment Account Required",
                    description: "You need to set up a payment account before adding tickets.",
                    variant: "destructive",
                  });
                  return;
                }
                setShowAddForm(true);
              }} />
            )}
          </>
        )}
      </TicketFormManager>
    </div>
  );
};

export default EventTicketing;
