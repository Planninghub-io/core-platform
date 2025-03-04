
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { EventTicketingHeader } from "./event-ticketing/components/EventTicketingHeader";
import { AddTicketForm } from "./event-ticketing/components/AddTicketForm";
import { TicketsList } from "./event-ticketing/components/TicketsList";
import { NoTicketsView } from "./event-ticketing/components/NoTicketsView";
import { Ticket } from "./event-ticketing/types";

const EventTicketing: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    
    const fetchEventAndTickets = async () => {
      try {
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (eventError) throw eventError;
        setEvent(eventData);

        // Fetch tickets
        const { data: ticketsData, error: ticketsError } = await supabase
          .from("event_ticketing")
          .select("*")
          .eq("event_id", eventId)
          .order("created_at", { ascending: false });

        if (ticketsError) throw ticketsError;
        setTickets(ticketsData || []);
      } catch (error) {
        console.error("Error fetching event and tickets:", error);
        toast({
          title: "Error",
          description: "Failed to load event or tickets information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndTickets();
  }, [eventId, toast]);

  const handleBack = () => {
    navigate(`/event/${eventId}`);
  };

  const handleAddTicket = async (newTicket: Omit<Ticket, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from("event_ticketing")
        .insert({
          ...newTicket,
          event_id: eventId
        })
        .select()
        .single();

      if (error) throw error;

      setTickets([data, ...tickets]);
      setShowAddForm(false);
      
      toast({
        description: "Ticket added successfully",
      });
    } catch (error) {
      console.error("Error adding ticket:", error);
      toast({
        title: "Error",
        description: "Failed to add ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;

    try {
      const { error } = await supabase
        .from("event_ticketing")
        .delete()
        .eq("id", ticketId);

      if (error) throw error;

      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
      
      toast({
        description: "Ticket deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast({
        title: "Error",
        description: "Failed to delete ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTicket = async (updatedTicket: Ticket) => {
    try {
      const { error } = await supabase
        .from("event_ticketing")
        .update({
          ticket_name: updatedTicket.ticket_name,
          description: updatedTicket.description,
          price: updatedTicket.price,
          quantity: updatedTicket.quantity,
          status: updatedTicket.status
        })
        .eq("id", updatedTicket.id);

      if (error) throw error;

      setTickets(tickets.map(ticket => 
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      ));
      
      toast({
        description: "Ticket updated successfully",
      });
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to update ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="mb-6">The event you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate('/events-hub')}>Back to Events</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <EventTicketingHeader 
        eventTitle={event.title} 
        onBack={handleBack}
        onAddTicket={() => setShowAddForm(true)}
        hasTickets={tickets.length > 0}
      />

      {showAddForm && (
        <AddTicketForm
          onSubmit={handleAddTicket}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {tickets.length > 0 ? (
        <TicketsList 
          tickets={tickets} 
          onDelete={handleDeleteTicket}
          onUpdate={handleUpdateTicket}
        />
      ) : (
        !showAddForm && <NoTicketsView onAddTicket={() => setShowAddForm(true)} />
      )}
    </div>
  );
};

export default EventTicketing;
