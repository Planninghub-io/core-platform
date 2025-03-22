
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { InvitationThemeDialog } from "./InvitationThemeDialog";

interface EventActionButtonsProps {
  eventId: string;
  hasInvites: boolean;
  hasTicketing: boolean;
  onGenerateInvitation: (theme: string) => void;
  category?: string | null;
}

export const EventActionButtons = ({
  eventId,
  hasInvites,
  hasTicketing,
  onGenerateInvitation,
  category
}: EventActionButtonsProps) => {
  const navigate = useNavigate();
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);

  const handleCreateInvitation = () => {
    setIsThemeDialogOpen(true);
  };

  const handleTicketingClick = () => {
    navigate(`/event/${eventId}/tickets`);
  };

  // Check if ticketing should be hidden based on event category
  const hideTicketing = category === 'wedding' || category === 'corporate' || category === 'Wedding' || category === 'Corporate Event';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {hasInvites ? (
          <Button 
            variant="outline"
            onClick={() => navigate(`/event/${eventId}/invitations`)}
            className={hideTicketing ? "w-full" : "flex-1"}
          >
            View Invitation
          </Button>
        ) : (
          <Button 
            variant="outline"
            onClick={handleCreateInvitation}
            className={hideTicketing ? "w-full" : "flex-1"}
          >
            Create Invitation
          </Button>
        )}
        
        {!hideTicketing && (
          <Button 
            variant="outline"
            onClick={handleTicketingClick}
            className="flex-1"
          >
            {hasTicketing ? 'Manage Tickets' : 'Add Ticketing'}
          </Button>
        )}
      </div>

      <InvitationThemeDialog
        isOpen={isThemeDialogOpen}
        onClose={() => setIsThemeDialogOpen(false)}
        onGenerateInvitation={onGenerateInvitation}
      />
    </div>
  );
};
