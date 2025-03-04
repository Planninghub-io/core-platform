
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Event } from "../types/event";

export const useEventFeatures = (event: Event) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasInvites, setHasInvites] = useState(false);
  const [hasTicketing, setHasTicketing] = useState(false);

  useEffect(() => {
    checkInvitesAndTicketing();
  }, [event.id]);

  const checkInvitesAndTicketing = async () => {
    try {
      // Check for invites
      const { data: invitations } = await supabase
        .from('invitations')
        .select('id')
        .eq('event_id', event.id)
        .limit(1);
      
      setHasInvites(invitations && invitations.length > 0);

      // Check for ticketing
      const { data: ticketing } = await supabase
        .from('event_ticketing')
        .select('id')
        .eq('event_id', event.id)
        .limit(1);
      
      setHasTicketing(ticketing && ticketing.length > 0);
    } catch (error) {
      console.error('Error checking invites and ticketing:', error);
    }
  };

  const generateInvitation = async (theme: string) => {
    try {
      // First, generate the invitation template
      const { data: generatedTemplate, error: generationError } = await supabase.functions.invoke(
        'generate-invitation',
        {
          body: { 
            eventDetails: {
              title: event.title,
              description: event.description,
              date: event.date,
              location: event.location
            },
            theme: theme || 'elegant and professional'
          }
        }
      );

      if (generationError) throw generationError;

      // Save template to database
      const { data: templateData, error: templateError } = await supabase
        .from('invitation_templates')
        .insert({
          name: `${event.title} Invitation`,
          description: theme || 'Elegant and Professional Theme',
          event_type: 'custom',
          template_html: generatedTemplate.template
        })
        .select()
        .single();

      if (templateError) throw templateError;

      // Create invitation with the new template
      const { error: invitationError } = await supabase
        .from('invitations')
        .insert({
          event_id: event.id,
          template_id: templateData.id,
          status: 'draft'
        });

      if (invitationError) throw invitationError;

      toast({
        description: "Invitation created successfully",
      });

      // Navigate to invitations page
      navigate(`/event/${event.id}/invitations`);
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast({
        title: "Error",
        description: "Failed to create invitation",
        variant: "destructive",
      });
    }
  };

  return {
    hasInvites,
    hasTicketing,
    generateInvitation
  };
};
