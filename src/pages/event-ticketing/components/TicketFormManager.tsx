
import React, { useState } from "react";
import { AddTicketForm } from "./AddTicketForm";
import { Ticket } from "../types";

interface TicketFormManagerProps {
  onAddTicket: (ticket: Omit<Ticket, "id" | "created_at" | "updated_at">) => Promise<boolean>;
  children: (showAddForm: boolean, setShowAddForm: (show: boolean) => void) => React.ReactNode;
  disableAddTicket?: boolean;
}

export const TicketFormManager: React.FC<TicketFormManagerProps> = ({ 
  onAddTicket, 
  children,
  disableAddTicket = false
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmitTicket = async (newTicket: Omit<Ticket, "id" | "created_at" | "updated_at">) => {
    if (disableAddTicket) {
      return false;
    }
    
    const success = await onAddTicket(newTicket);
    if (success) {
      setShowAddForm(false);
    }
    return success;
  };

  return (
    <>
      {showAddForm && !disableAddTicket && (
        <AddTicketForm
          onSubmit={handleSubmitTicket}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      
      {children(showAddForm, setShowAddForm)}
    </>
  );
};
