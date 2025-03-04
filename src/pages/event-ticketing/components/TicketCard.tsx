
import { Ticket } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

interface TicketCardProps {
  ticket: Ticket;
  onEdit: () => void;
  onDelete: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onEdit, onDelete }) => {
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "draft": return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "paused": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "sold_out": return "bg-red-100 text-red-800 hover:bg-red-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return "Free";
    return `$${price.toFixed(2)}`;
  };

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{ticket.name}</h3>
              <Badge className={getStatusColor(ticket.status)} variant="outline">
                {ticket.status?.replace("_", " ") || "Active"}
              </Badge>
            </div>
            
            {ticket.description && (
              <p className="text-sm text-muted-foreground">{ticket.description}</p>
            )}
            
            <div className="flex flex-wrap gap-4 mt-2">
              <div>
                <span className="text-sm text-muted-foreground">Price: </span>
                <span className="font-medium">{formatPrice(ticket.price)}</span>
              </div>
              
              <div>
                <span className="text-sm text-muted-foreground">Quantity: </span>
                <span className="font-medium">
                  {ticket.is_unlimited ? "Unlimited" : (ticket.quantity || 0)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={onDelete} className="text-red-500 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
