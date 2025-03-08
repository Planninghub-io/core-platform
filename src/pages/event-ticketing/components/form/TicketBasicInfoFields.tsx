
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { Ticket } from "../../types";

interface TicketBasicInfoFieldsProps {
  ticket: Partial<Ticket>;
  onInputChange: (field: keyof Ticket, value: any) => void;
}

export const TicketBasicInfoFields = ({ 
  ticket, 
  onInputChange 
}: TicketBasicInfoFieldsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="name" className="text-base font-medium">
            Ticket name <span className="text-red-500">*</span>
          </Label>
          <Info size={16} className="text-gray-400" />
        </div>
        <Input
          id="name"
          value={ticket.name || ""}
          onChange={(e) => onInputChange("name", e.target.value)}
          placeholder="e.g., General Admission"
          required
          className="text-base"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="quantity" className="text-base font-medium">
            Quantity <span className="text-red-500">*</span>
          </Label>
          <Info size={16} className="text-gray-400" />
        </div>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={ticket.quantity || ""}
          onChange={(e) => onInputChange("quantity", e.target.value ? parseInt(e.target.value) : null)}
          placeholder="Number of tickets available"
          required={!ticket.is_unlimited}
          className="text-base"
        />
      </div>
    </div>
  );
};
