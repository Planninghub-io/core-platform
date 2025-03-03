
import { useParams, useNavigate } from "react-router-dom";
import { InvitationDialog } from "@/components/event-details/InvitationDialog";
import { ThemeDialog } from "./event-invitations/components/ThemeDialog";
import { EventInvitationsHeader } from "./event-invitations/components/EventInvitationsHeader";
import { InvitationsList } from "./event-invitations/components/InvitationsList";
import { useInvitations } from "./event-invitations/hooks/useInvitations";

const EventInvitations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    invitations,
    loading,
    eventDetails,
    isInvitationDialogOpen,
    isThemeDialogOpen,
    themeDescription,
    editingInvitation,
    setIsInvitationDialogOpen,
    setIsThemeDialogOpen,
    setThemeDescription,
    handleEditInvitation,
    handleGenerateInvitation
  } = useInvitations(id!);

  return (
    <div className="container py-8">
      <EventInvitationsHeader 
        title="Event Invitations"
        hasInvitations={invitations.length > 0}
        onBack={() => navigate(`/event/${id}?edit=true`)}
        onOpenSendDialog={() => setIsInvitationDialogOpen(true)}
      />

      <InvitationsList 
        invitations={invitations}
        loading={loading}
        onEditInvitation={handleEditInvitation}
      />

      <ThemeDialog
        isOpen={isThemeDialogOpen}
        onClose={() => {
          setIsThemeDialogOpen(false);
          setThemeDescription("");
        }}
        themeDescription={themeDescription}
        onThemeChange={setThemeDescription}
        onSubmit={handleGenerateInvitation}
        isEditing={!!editingInvitation}
      />

      <InvitationDialog
        isOpen={isInvitationDialogOpen}
        onClose={() => setIsInvitationDialogOpen(false)}
        eventId={id!}
        eventType="custom"
      />
    </div>
  );
};

export default EventInvitations;
