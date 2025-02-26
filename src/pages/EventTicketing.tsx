
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TicketType {
  id: string;
  ticket_name: string;
  price: number | null;
  quantity: number | null;
  description: string | null;
  status: string;
  event_id: string;
  created_at: string;
}

const EventTicketing = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [newTicket, setNewTicket] = useState({
    ticket_name: '',
    price: null as number | null,
    quantity: null as number | null,
    description: null as string | null,
  });

  useEffect(() => {
    fetchTickets();
  }, [eventId]);

  const fetchTickets = async () => {
    if (!eventId) return;
    
    try {
      const { data, error } = await supabase
        .from('event_ticketing')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "Failed to load tickets",
        variant: "destructive",
      });
    }
  };

  const handleAddTicket = async () => {
    if (!eventId || !newTicket.ticket_name) return;

    try {
      const ticketData = {
        event_id: eventId,
        ticket_name: newTicket.ticket_name,
        price: newTicket.price,
        quantity: newTicket.quantity,
        description: newTicket.description,
      };

      const { error } = await supabase
        .from('event_ticketing')
        .insert(ticketData);

      if (error) throw error;

      toast({
        description: "Ticket type added successfully",
      });
      
      setNewTicket({
        ticket_name: '',
        price: null,
        quantity: null,
        description: null,
      });
      
      fetchTickets();
    } catch (error) {
      console.error('Error adding ticket:', error);
      toast({
        title: "Error",
        description: "Failed to add ticket",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Event Ticketing</h1>
        <Button variant="outline" onClick={() => navigate(`/event/${eventId}`)}>
          Back to Event
        </Button>
      </div>

      <div className="space-y-6 bg-card p-6 rounded-lg">
        <h2 className="text-xl font-semibold">Add New Ticket Type</h2>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="ticket_name">Ticket Name</Label>
            <Input
              id="ticket_name"
              value={newTicket.ticket_name}
              onChange={(e) => setNewTicket(prev => ({ ...prev, ticket_name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={newTicket.price || ''}
                onChange={(e) => setNewTicket(prev => ({ ...prev, price: e.target.value ? parseFloat(e.target.value) : null }))}
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity Available</Label>
              <Input
                id="quantity"
                type="number"
                value={newTicket.quantity || ''}
                onChange={(e) => setNewTicket(prev => ({ ...prev, quantity: e.target.value ? parseInt(e.target.value) : null }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full min-h-[100px] p-2 border rounded-md"
              value={newTicket.description || ''}
              onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value || null }))}
            />
          </div>
          <Button onClick={handleAddTicket} disabled={!newTicket.ticket_name}>
            Add Ticket Type
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-muted-foreground">No tickets created yet</p>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 border rounded-lg flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">{ticket.ticket_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Price: ${ticket.price} | Available: {ticket.quantity}
                  </p>
                  {ticket.description && (
                    <p className="text-sm mt-1">{ticket.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* TODO: Add edit functionality */}}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventTicketing;
