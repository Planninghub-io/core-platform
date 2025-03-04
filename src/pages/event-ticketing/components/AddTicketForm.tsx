
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket as TicketType } from "../types";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Info, ChevronDown, ChevronUp, X } from "lucide-react";
import { PriceSummary } from "./PriceSummary";

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

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field: keyof typeof ticket, value: any) => {
    setTicket(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(ticket);
  };

  return (
    <Card className="mb-8 p-0 border shadow-sm">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-2xl font-semibold">
          {initialData ? "Edit ticket type" : "Add a new ticket type"}
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel}
          className="rounded-full hover:bg-gray-100"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6">
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
                value={ticket.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
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
                onChange={(e) => handleInputChange("quantity", e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Number of tickets available"
                required={!ticket.is_unlimited}
                className="text-base"
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="p-6">
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
                    onChange={(e) => handleInputChange("price", e.target.value ? parseFloat(e.target.value) : null)}
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
                    handleInputChange("booking_fee", checked === true)
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
        </div>
        
        <Separator />
        
        <div 
          className="p-6 cursor-pointer" 
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <div className="flex items-center space-x-2">
            {showAdvanced ? 
              <ChevronUp className="h-5 w-5" /> : 
              <ChevronDown className="h-5 w-5" />
            }
            <span className="text-lg font-medium">Advanced settings</span>
          </div>
        </div>
        
        {showAdvanced && (
          <>
            <div className="p-6 pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="description" className="text-base font-medium">Description</Label>
                  <Info size={16} className="text-gray-400" />
                </div>
                <Textarea
                  id="description"
                  value={ticket.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe what's included with this ticket type"
                  className="min-h-[120px] text-base"
                />
              </div>
              
              <div className="space-y-2 mt-6">
                <div className="flex items-center gap-2">
                  <Label htmlFor="status" className="text-base font-medium">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Info size={16} className="text-gray-400" />
                </div>
                <Select 
                  defaultValue={ticket.status || "active"}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">On sale</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="sold_out">Sold Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
          </>
        )}
        
        <div className="flex justify-end space-x-2 p-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Ticket" : "Create Ticket"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
