
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ensureUUID } from "@/utils/supabaseHelpers";

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
          .eq('event_id', ensureUUID(eventId))
          .limit(1);
        
        if (invitationsError) {
          console.error("Error checking invitations:", invitationsError);
        } else {
          setHasInvites(invitationsData && invitationsData.length > 0);
        }
        
        // Check if event has ticketing
        const { data: ticketingData, error: ticketingError } = await supabase
          .from('ticket_types')
          .select('id')
          .eq('event_id', ensureUUID(eventId))
          .limit(1);
        
        if (ticketingError) {
          console.error("Error checking tickets:", ticketingError);
        } else {
          setHasTicketing(ticketingData && ticketingData.length > 0);
        }
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
        .eq('id', ensureUUID(eventId))
        .single();
        
      if (eventError) {
        console.error("Error fetching event:", eventError);
        throw eventError;
      }
      
      if (!eventData) {
        throw new Error("No event data found");
      }
      
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

      if (generationError) {
        console.error("Error generating template:", generationError);
        throw generationError;
      }

      if (!generatedTemplate || !generatedTemplate.template) {
        throw new Error("No template generated");
      }

      // Create a new template record
      const { data: templateData, error: templateError } = await supabase
        .from('invitation_templates')
        .insert({
          name: `${eventData.title} Invitation`,
          description: theme || 'Elegant and Professional Theme',
          event_type: 'custom',
          template_html: generatedTemplate.template
        } as any) // Use type assertion to bypass TypeScript's strict typing
        .select()
        .single();

      if (templateError) {
        console.error("Error creating template:", templateError);
        throw templateError;
      }

      if (!templateData || !('id' in templateData)) {
        throw new Error("Template creation failed");
      }

      // Create the invitation using the template
      const { data: invitationData, error: invitationError } = await supabase
        .from('invitations')
        .insert({
          event_id: ensureUUID(eventId),
          template_id: templateData.id,
          status: 'draft'
        } as any) // Use type assertion
        .select();

      if (invitationError) {
        console.error("Error creating invitation:", invitationError);
        throw invitationError;
      }
      
      // Update state to indicate invitation was created
      setHasInvites(true);
      
      toast({
        description: "Invitation created successfully!",
      });
      
      // Redirect to invitation page
      navigate(`/event/${eventId}/invitations`);
      
    } catch (error: any) {
      console.error('Error generating invitation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create invitation. Please try again.",
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
