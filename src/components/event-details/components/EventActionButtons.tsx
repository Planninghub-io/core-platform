
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { InvitationThemeDialog } from "./InvitationThemeDialog";

interface EventActionButtonsProps {
  eventId: string;
  hasInvites: boolean;
  hasTicketing: boolean;
  onGenerateInvitation: (theme: string) => void;
}

export const EventActionButtons = ({
  eventId,
  hasInvites,
  hasTicketing,
  onGenerateInvitation,
}: EventActionButtonsProps) => {
  const navigate = useNavigate();
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);

  const handleCreateInvitation = () => {
    setIsThemeDialogOpen(true);
  };

  return (
    <div className="flex gap-4">
      {hasInvites ? (
        <Button 
          variant="outline"
          onClick={() => navigate(`/event/${eventId}/invitations`)}
          className="flex-1"
        >
          View Invite
        </Button>
      ) : (
        <Button 
          variant="outline"
          onClick={handleCreateInvitation}
          className="flex-1"
        >
          Create Invite
        </Button>
      )}
      <Button 
        variant="outline"
        onClick={() => navigate(`/event/${eventId}/ticketing`)}
        className="flex-1"
      >
        {hasTicketing ? 'Manage Tickets' : 'Add Ticketing'}
      </Button>

      <InvitationThemeDialog
        isOpen={isThemeDialogOpen}
        onClose={() => setIsThemeDialogOpen(false)}
        onGenerateInvitation={onGenerateInvitation}
      />
    </div>
  );
};
