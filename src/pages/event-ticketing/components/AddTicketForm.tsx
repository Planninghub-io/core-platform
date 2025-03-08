
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Ticket as TicketType } from "../types";
import { TicketFormHeader } from "./form/TicketFormHeader";
import { TicketBasicInfoFields } from "./form/TicketBasicInfoFields";
import { TicketPriceFields } from "./form/TicketPriceFields";
import { TicketAdvancedFields } from "./form/TicketAdvancedFields";
import { TicketFormFooter } from "./form/TicketFormFooter";

interface AddTicketFormProps {
  onSubmit: (ticket: Omit<TicketType, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
  initialData?: Partial<TicketType>;
}

export const AddTicketForm: React.FC<AddTicketFormProps> = ({ 
  onSubmit, 
  onCancel,
  initialData 
}) => {
  const [ticket, setTicket] = useState<Omit<TicketType, "id" | "created_at" | "updated_at">>({
    event_id: "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || null,
    quantity: initialData?.quantity || null,
    is_unlimited: initialData?.is_unlimited !== undefined ? initialData.is_unlimited : false,
    status: initialData?.status || "active",
    booking_fee: initialData?.booking_fee || false
  });

  const handleInputChange = (field: keyof typeof ticket, value: any) => {
    setTicket(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(ticket);
  };

  return (
    <Card className="mb-8 p-0 border shadow-sm">
      <TicketFormHeader 
        isEditing={!!initialData} 
        onCancel={onCancel} 
      />

      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <TicketBasicInfoFields 
            ticket={ticket} 
            onInputChange={handleInputChange} 
          />
        </div>
        
        <Separator />
        
        <div className="p-6">
          <TicketPriceFields 
            ticket={ticket} 
            onInputChange={handleInputChange} 
          />
        </div>
        
        <Separator />
        
        <TicketAdvancedFields 
          ticket={ticket} 
          onInputChange={handleInputChange} 
        />
        
        <TicketFormFooter 
          isEditing={!!initialData} 
          onCancel={onCancel} 
        />
      </form>
    </Card>
  );
};
