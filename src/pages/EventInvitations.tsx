
import { useParams, useNavigate } from "react-router-dom";
import { InvitationDialog } from "@/components/event-details/InvitationDialog";
import { ThemeDialog } from "./event-invitations/components/ThemeDialog";
import { EventInvitationsHeader } from "./event-invitations/components/EventInvitationsHeader";
import { InvitationsList } from "./event-invitations/components/InvitationsList";
import { useInvitations } from "./event-invitations/hooks/useInvitations";
import { useEffect } from "react";

const EventInvitations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    invitations,
    loading,
    isInvitationDialogOpen,
    isThemeDialogOpen,
    themeDescription,
    editingInvitation,
    setIsInvitationDialogOpen,
    setIsThemeDialogOpen,
    setThemeDescription,
    handleEditInvitation,
    handleGenerateInvitation,
    fetchInvitations
  } = useInvitations(id!);

  useEffect(() => {
    // Re-fetch invitations when component mounts or ID changes
    if (id) {
      fetchInvitations();
    }
  }, [id]);

  console.log("Event ID:", id);
  console.log("Invitations:", invitations);
  console.log("Loading state:", loading);

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
