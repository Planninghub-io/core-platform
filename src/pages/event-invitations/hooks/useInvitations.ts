
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type Invitation, type Event } from "../types";

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
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('id, title, description, date, location')
        .eq('id', eventId)
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
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      console.log('Fetching invitations for event ID:', eventId);
      
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
        .eq('event_id', eventId);

      if (error) throw error;
      
      console.log('Fetched invitations:', data);
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

  const handleEditInvitation = (invitation: Invitation) => {
    console.log('Editing invitation:', invitation);
    setEditingInvitation(invitation);
    setThemeDescription(invitation.invitation_templates.description || "");
    setIsThemeDialogOpen(true);
  };

  const handleGenerateInvitation = async (customTheme?: string) => {
    if (!eventDetails) return;

    try {
      setLoading(true);
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

      if (editingInvitation) {
        const { error: templateError } = await supabase
          .from('invitation_templates')
          .update({
            description: customTheme || 'Elegant and Professional Theme',
            template_html: generatedTemplate.template
          })
          .eq('id', editingInvitation.template_id);

        if (templateError) throw templateError;
      } else {
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
            event_id: eventId,
            template_id: templateData.id,
            status: 'draft'
          });

        if (invitationError) throw invitationError;
      }

      await fetchInvitations();
      setIsThemeDialogOpen(false);
      setThemeDescription("");
      setEditingInvitation(null);
      toast({
        description: editingInvitation ? "Invitation updated successfully" : "Invitation created successfully",
      });
    } catch (error) {
      console.error('Error with invitation:', error);
      toast({
        title: "Error",
        description: editingInvitation ? "Failed to update invitation" : "Failed to generate invitation",
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
    handleGenerateInvitation,
    fetchInvitations
  };
};
