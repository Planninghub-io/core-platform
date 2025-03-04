
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

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
    is_unlimited: initialData?.is_unlimited !== undefined ? initialData.is_unlimited : true,
    status: initialData?.status || "active"
  });

  const handleInputChange = (field: keyof typeof ticket, value: any) => {
    setTicket(prev => ({ ...prev, [field]: value }));
  };

  const handleUnlimitedToggle = (checked: boolean) => {
    setTicket(prev => ({ 
      ...prev, 
      is_unlimited: checked,
      quantity: checked ? null : prev.quantity || 100
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(ticket);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Ticket" : "Add New Ticket"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Ticket Name *</Label>
              <Input
                id="name"
                value={ticket.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., General Admission"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={ticket.price || ""}
                onChange={(e) => handleInputChange("price", e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="e.g., 25.00"
              />
              <p className="text-xs text-muted-foreground">Leave empty for free tickets</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={ticket.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what's included with this ticket type"
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_unlimited">Unlimited Tickets</Label>
                <Switch 
                  id="is_unlimited"
                  checked={ticket.is_unlimited}
                  onCheckedChange={handleUnlimitedToggle}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Toggle on for unlimited tickets, off to set a specific quantity
              </p>
            </div>
            
            {!ticket.is_unlimited && (
              <div className="space-y-2">
                <Label htmlFor="quantity">Maximum Tickets</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={ticket.quantity || ""}
                  onChange={(e) => handleInputChange("quantity", e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="e.g., 100"
                  required={!ticket.is_unlimited}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              defaultValue={ticket.status || "active"}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="sold_out">Sold Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Ticket" : "Create Ticket"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
