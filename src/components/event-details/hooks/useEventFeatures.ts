
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface EventFeaturesProps {
  eventId: string;
}

export const useEventFeatures = ({ eventId }: EventFeaturesProps) => {
  const [hasInvites, setHasInvites] = useState(false);
  const [hasTicketing, setHasTicketing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const generateInvitation = (theme: string) => {
    // This function is needed by LeftPanel but was missing in the hook
    toast({
      description: `Generating invitation with theme: ${theme}`,
    });
    // Invitation generation logic would go here
  };

  return {
    hasInvites,
    hasTicketing,
    loading,
    generateInvitation
  };
};
