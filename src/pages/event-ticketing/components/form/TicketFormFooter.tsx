
import { Button } from "@/components/ui/button";

interface TicketFormFooterProps {
  isEditing: boolean;
  onCancel: () => void;
}

export const TicketFormFooter = ({ isEditing, onCancel }: TicketFormFooterProps) => {
  return (
    <div className="flex justify-end space-x-2 p-6">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? "Update Ticket" : "Create Ticket"}
      </Button>
    </div>
  );
};
