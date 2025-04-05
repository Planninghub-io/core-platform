
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Ticket } from "../types";
import { ensureUUID } from "@/utils/supabaseHelpers";

export const useTickets = (eventId: string | undefined) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!eventId) return;
    
    const fetchTickets = async () => {
      try {
        const { data: ticketsData, error: ticketsError } = await supabase
          .from("ticket_types")
          .select("*")
          .eq("event_id", ensureUUID(eventId))
          .order("created_at", { ascending: false });

        if (ticketsError) throw ticketsError;
        
        if (ticketsData) {
          setTickets(ticketsData as Ticket[]);
        } else {
          setTickets([]);
        }
      } catch (error: any) {
        console.error("Error fetching tickets:", error);
        toast({
          title: "Error",
          description: "Failed to load tickets information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [eventId, toast]);

  const addTicket = async (newTicket: Omit<Ticket, "id" | "created_at" | "updated_at">) => {
    if (!eventId) return false;
    
    try {
      const ticketToInsert = {
        name: newTicket.name,
        description: newTicket.description,
        price: newTicket.price,
        quantity: newTicket.quantity,
        is_unlimited: newTicket.is_unlimited,
        status: newTicket.status,
        booking_fee: newTicket.booking_fee,
        event_id: eventId
      };
      
      const { data, error } = await supabase
        .from("ticket_types")
        .insert([ticketToInsert])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setTickets(prevTickets => [data as Ticket, ...prevTickets]);
      }
      
      toast({
        description: "Ticket added successfully",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error adding ticket:", error);
      toast({
        title: "Error",
        description: "Failed to add ticket. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteTicket = async (ticketId: string) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return false;

    try {
      const { error } = await supabase
        .from("ticket_types")
        .delete()
        .eq("id", ensureUUID(ticketId));

      if (error) throw error;

      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
      
      toast({
        description: "Ticket deleted successfully",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error deleting ticket:", error);
      toast({
        title: "Error",
        description: "Failed to delete ticket. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateTicket = async (updatedTicket: Ticket) => {
    try {
      const ticketToUpdate = {
        name: updatedTicket.name,
        description: updatedTicket.description,
        price: updatedTicket.price,
        quantity: updatedTicket.quantity,
        is_unlimited: updatedTicket.is_unlimited,
        status: updatedTicket.status,
        booking_fee: updatedTicket.booking_fee
      };
      
      const { error } = await supabase
        .from("ticket_types")
        .update(ticketToUpdate)
        .eq("id", ensureUUID(updatedTicket.id));

      if (error) throw error;

      setTickets(tickets.map(ticket => 
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      ));
      
      toast({
        description: "Ticket updated successfully",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to update ticket. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    tickets,
    loading,
    addTicket,
    deleteTicket,
    updateTicket
  };
};
