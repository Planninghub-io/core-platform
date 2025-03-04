
import { useState } from "react";
import { Ticket } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketCard } from "./TicketCard";
import { AddTicketForm } from "./AddTicketForm";

interface TicketsListProps {
  tickets: Ticket[];
  onDelete: (id: string) => void;
  onUpdate: (ticket: Ticket) => void;
}

export const TicketsList: React.FC<TicketsListProps> = ({ tickets, onDelete, onUpdate }) => {
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);

  const handleEdit = (ticketId: string) => {
    setEditingTicketId(ticketId);
  };

  const handleUpdate = (updatedTicket: Omit<Ticket, "id" | "created_at" | "updated_at">) => {
    if (!editingTicketId) return;
    
    const ticketToUpdate = tickets.find(t => t.id === editingTicketId);
    if (!ticketToUpdate) return;
    
    onUpdate({
      ...ticketToUpdate,
      ...updatedTicket
    });
    
    setEditingTicketId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tickets ({tickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div key={ticket.id}>
                {editingTicketId === ticket.id ? (
                  <AddTicketForm
                    initialData={ticket}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditingTicketId(null)}
                  />
                ) : (
                  <TicketCard
                    ticket={ticket}
                    onEdit={() => handleEdit(ticket.id)}
                    onDelete={() => onDelete(ticket.id)}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
