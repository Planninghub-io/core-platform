
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TicketFormHeaderProps {
  isEditing: boolean;
  onCancel: () => void;
}

export const TicketFormHeader = ({ isEditing, onCancel }: TicketFormHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <h2 className="text-2xl font-semibold">
        {isEditing ? "Edit ticket type" : "Add a new ticket type"}
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
  );
};
