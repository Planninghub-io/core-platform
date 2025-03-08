
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";
import { Ticket } from "../../types";
import { PriceSummary } from "../PriceSummary";

interface TicketPriceFieldsProps {
  ticket: Partial<Ticket>;
  onInputChange: (field: keyof Ticket, value: any) => void;
}

export const TicketPriceFields = ({ 
  ticket, 
  onInputChange 
}: TicketPriceFieldsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-base font-medium">
            Ticket price
          </Label>
          <div className="flex">
            <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-gray-50">
              $
            </div>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={ticket.price || ""}
              onChange={(e) => onInputChange("price", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="0.00"
              className="rounded-l-none text-base"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox 
            id="booking_fee"
            checked={ticket.booking_fee}
            onCheckedChange={(checked) => 
              onInputChange("booking_fee", checked === true)
            }
          />
          <div className="flex items-center">
            <Label htmlFor="booking_fee" className="text-base">
              Add booking fee
            </Label>
            <Info size={16} className="ml-2 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="md:col-span-1">
        <PriceSummary 
          price={ticket.price}
          hasBookingFee={ticket.booking_fee}
        />
      </div>
    </div>
  );
};
