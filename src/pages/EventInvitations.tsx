
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InvitationDialog } from "@/components/event-details/InvitationDialog";
import { InvitationCard } from "./event-invitations/components/InvitationCard";
import { ThemeDialog } from "./event-invitations/components/ThemeDialog";
import { type Invitation, type Event } from "./event-invitations/types";

const EventInvitations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInvitationDialogOpen, setIsInvitationDialogOpen] = useState(false);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [themeDescription, setThemeDescription] = useState("");
  const [eventDetails, setEventDetails] = useState<Event | null>(null);

  useEffect(() => {
    fetchEventDetails();
    fetchInvitations();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, description, date, location')
        .eq('id', id)
        .single();

      if (error) throw error;
      setEventDetails(data);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch event details",
        variant: "destructive",
      });
    }
  };

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select(`
          *,
          invitation_recipients (
            id,
            status,
            delivery_method,
            sent_at,
            contacts (
              name,
              email,
              phone
            )
          ),
          invitation_templates (
            name,
            description,
            template_html
          )
        `)
        .eq('event_id', id)
        .returns<Invitation[]>();

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast({
        title: "Error",
        description: "Failed to load invitations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvitation = async (customTheme?: string) => {
    if (!eventDetails) return;

    try {
      const { data: generatedTemplate, error: generationError } = await supabase.functions.invoke(
        'generate-invitation',
        {
          body: { 
            eventDetails,
            theme: customTheme || 'elegant and professional'
          }
        }
      );

      if (generationError) throw generationError;

      const { data: templateData, error: templateError } = await supabase
        .from('invitation_templates')
        .insert({
          name: `${eventDetails.title} Invitation`,
          description: customTheme || 'Elegant and Professional Theme',
          event_type: 'custom',
          template_html: generatedTemplate.template
        })
        .select()
        .single();

      if (templateError) throw templateError;

      const { error: invitationError } = await supabase
        .from('invitations')
        .insert({
          event_id: id,
          template_id: templateData.id,
          status: 'draft'
        });

      if (invitationError) throw invitationError;

      await fetchInvitations();
      setIsThemeDialogOpen(false);
      setThemeDescription("");
      toast({
        description: "Invitation created successfully",
      });
    } catch (error) {
      console.error('Error generating invitation:', error);
      toast({
        title: "Error",
        description: "Failed to generate invitation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(`/event/${id}?edit=true`)} className="px-3">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Event Invitations</h1>
        </div>
        <div>
          {invitations.length > 0 && (
            <Button onClick={() => setIsInvitationDialogOpen(true)} variant="default">
              <Send className="h-4 w-4 mr-2" />
              Send Invitations
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div>Loading invitations...</div>
      ) : invitations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No invitations have been created for this event yet.
        </div>
      ) : (
        <div className="space-y-6">
          {invitations.map((invitation) => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              onEdit={() => {
                setThemeDescription(invitation.invitation_templates.description || "");
                setIsThemeDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <ThemeDialog
        isOpen={isThemeDialogOpen}
        onClose={() => setIsThemeDialogOpen(false)}
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
