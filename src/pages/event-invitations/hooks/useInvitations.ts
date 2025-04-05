
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type Invitation, type Event } from "../types";
import { ensureUUID } from "@/utils/supabaseHelpers";

export const useInvitations = (eventId: string) => {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [eventDetails, setEventDetails] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingInvitation, setEditingInvitation] = useState<Invitation | null>(null);
  const [themeDescription, setThemeDescription] = useState("");
  const [isInvitationDialogOpen, setIsInvitationDialogOpen] = useState(false);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      fetchInvitations();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    if (!eventId) return;
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, description, date, location')
        .eq('id', ensureUUID(eventId))
        .single();

      if (error) throw error;
      
      if (data) {
        setEventDetails(data as Event);
      }
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
    if (!eventId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('invitations')
        .select(`
          *,
          invitation_recipients (
            id,
            status,
            delivery_method,
            sent_at,
            rsvp_status,
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
        .eq('event_id', ensureUUID(eventId));

      if (error) throw error;
      
      if (!data) {
        setInvitations([]);
        return;
      }
      
      // Transform and validate the data
      const typedInvitations = data.map(inv => {
        // Ensure we have properly typed data
        const recipients = Array.isArray(inv.invitation_recipients) 
          ? inv.invitation_recipients.map(recipient => ({
              ...recipient,
              rsvp_status: (recipient.rsvp_status === 'accepted' || 
                            recipient.rsvp_status === 'declined' || 
                            recipient.rsvp_status === 'maybe') 
                            ? recipient.rsvp_status 
                            : null
            }))
          : [];
          
        return {
          ...inv,
          invitation_recipients: recipients,
          invitation_templates: inv.invitation_templates || {
            name: 'Unknown Template',
            description: null,
            template_html: ''
          }
        } as Invitation;
      });
      
      setInvitations(typedInvitations);
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

  const handleEditInvitation = (invitation: Invitation) => {
    setEditingInvitation(invitation);
    setThemeDescription(invitation.invitation_templates?.description || "");
    setIsThemeDialogOpen(true);
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
      
      if (!generatedTemplate || !generatedTemplate.template) {
        throw new Error("Failed to generate template");
      }

      if (editingInvitation) {
        // Update existing template
        const { error: templateError } = await supabase
          .from('invitation_templates')
          .update({
            description: customTheme || 'Elegant and Professional Theme',
            template_html: generatedTemplate.template
          })
          .eq('id', ensureUUID(editingInvitation.template_id));

        if (templateError) throw templateError;
      } else {
        // Create new template and invitation
        const { data: templateData, error: templateError } = await supabase
          .from('invitation_templates')
          .insert([{
            name: `${eventDetails.title} Invitation`,
            description: customTheme || 'Elegant and Professional Theme',
            event_type: 'custom',
            template_html: generatedTemplate.template
          }])
          .select()
          .single();

        if (templateError) throw templateError;
        
        if (!templateData) {
          throw new Error("Failed to create template");
        }

        const { error: invitationError } = await supabase
          .from('invitations')
          .insert([{
            event_id: eventId,
            template_id: templateData.id,
            status: 'draft'
          }]);

        if (invitationError) throw invitationError;
      }

      await fetchInvitations();
      setIsThemeDialogOpen(false);
      setThemeDescription("");
      setEditingInvitation(null);
      toast({
        description: editingInvitation ? "Invitation updated successfully" : "Invitation created successfully",
      });
    } catch (error: any) {
      console.error('Error with invitation:', error);
      toast({
        title: "Error",
        description: error.message || (editingInvitation ? "Failed to update invitation" : "Failed to generate invitation"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
