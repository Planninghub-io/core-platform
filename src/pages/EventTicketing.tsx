
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
      const errorMessage = stripeError ? decodeURIComponent(stripeError) : "Connection failed for unknown reason";
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [searchParams, toast, checkStripeAccount]);

  const handleBack = () => {
    navigate(`/event/${eventId}`);
  };

  const handleConnectStripe = () => {
    try {
      if (typeof connectStripeAccount === 'function') {
        connectStripeAccount();
      } else {
        console.error("connectStripeAccount is not a function");
        toast({
          title: "Error",
          description: "Could not initiate payment account connection. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error connecting to Stripe:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    }
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
      {hasStripeAccount === false && (
        <PaymentAccountAlert onSetupAccount={handleConnectStripe} />
      )}
      
      <TicketFormManager 
        onAddTicket={addTicket}
        disableAddTicket={!hasStripeAccount}
      >
        {(showAddForm, setShowAddForm) => (
          <>
            <EventTicketingHeader 
              eventTitle={event.title || "Untitled Event"} 
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
              hasTickets={tickets && tickets.length > 0}
            />

            {tickets && tickets.length > 0 ? (
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
