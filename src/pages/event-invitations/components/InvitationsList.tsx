
import { InvitationCard } from "./InvitationCard";
import { type Invitation } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

interface InvitationsListProps {
  invitations: Invitation[];
  loading: boolean;
  onEditInvitation: (invitation: Invitation) => void;
}

export const InvitationsList = ({
  invitations,
  loading,
  onEditInvitation
}: InvitationsListProps) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="w-full h-60" />
        ))}
      </div>
    );
  }
  
  if (!invitations || invitations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No invitations have been created for this event yet.
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {invitations.map((invitation) => (
        <InvitationCard
          key={invitation.id}
          invitation={invitation}
          onEdit={() => onEditInvitation(invitation)}
        />
      ))}
    </div>
  );
};
