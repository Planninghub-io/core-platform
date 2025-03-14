
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface EventFeaturesProps {
  eventId: string;
}

export const useEventFeatures = ({ eventId }: EventFeaturesProps) => {
  const [hasInvites, setHasInvites] = useState(false);
  const [hasTicketing, setHasTicketing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkEventFeatures = async () => {
      try {
        setLoading(true);
        
        // Check if event has invitations
        const { data: invitationsData, error: invitationsError } = await supabase
          .from('invitations')
          .select('id')
          .eq('event_id', eventId)
          .limit(1);
        
        if (invitationsError) {
          throw invitationsError;
        }
        
        setHasInvites(invitationsData && invitationsData.length > 0);
        
        // Check if event has ticketing
        const { data: ticketingData, error: ticketingError } = await supabase
          .from('ticket_types')
          .select('id')
          .eq('event_id', eventId)
          .limit(1);
        
        if (ticketingError) {
          throw ticketingError;
        }
        
        setHasTicketing(ticketingData && ticketingData.length > 0);
      } catch (error) {
        console.error('Error checking event features:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (eventId) {
      checkEventFeatures();
    }
  }, [eventId]);

  const generateInvitation = async (theme: string) => {
    try {
      toast({
        description: `Generating invitation with theme: ${theme}`,
      });
      
      // Get event details to use for invitation
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
        
      if (eventError) throw eventError;
      
      // Generate invitation template using the edge function
      const { data: generatedTemplate, error: generationError } = await supabase.functions.invoke(
        'generate-invitation',
        {
          body: { 
            eventDetails: eventData,
            theme: theme
          }
        }
      );

      if (generationError) throw generationError;

      // Create a new template record
      const { data: templateData, error: templateError } = await supabase
        .from('invitation_templates')
        .insert({
          name: `${eventData.title} Invitation`,
          description: theme || 'Elegant and Professional Theme',
          event_type: 'custom',
          template_html: generatedTemplate.template
        })
        .select()
        .single();

      if (templateError) throw templateError;

      // Create the invitation using the template
      const { error: invitationError } = await supabase
        .from('invitations')
        .insert({
          event_id: eventId,
          template_id: templateData.id,
          status: 'draft'
        });

      if (invitationError) throw invitationError;
      
      // Update state to indicate invitation was created
      setHasInvites(true);
      
      toast({
        description: "Invitation created successfully!",
      });
      
      // Redirect to invitation page
      navigate(`/event/${eventId}/invitations`);
      
    } catch (error) {
      console.error('Error generating invitation:', error);
      toast({
        title: "Error",
        description: "Failed to create invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    hasInvites,
    hasTicketing,
    loading,
    generateInvitation
  };
};
