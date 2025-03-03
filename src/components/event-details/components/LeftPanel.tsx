
import { EventImage } from "../EventImage";
import { EventAIDialog } from "../EventAIDialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Event } from "../types/event";

interface LeftPanelProps {
  event: Event;
  isEditing: boolean;
  viewMode: 'details' | 'ai' | 'dashboard';
  onFieldChange: (field: string, value: string | number) => void;
}

export const LeftPanel = ({
  event,
  isEditing,
  viewMode,
  onFieldChange
}: LeftPanelProps) => {
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

  const handleCreateInvitation = async () => {
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
            theme: 'elegant and professional'
          }
        }
      );

      if (generationError) throw generationError;

      // Save template to database
      const { data: templateData, error: templateError } = await supabase
        .from('invitation_templates')
        .insert({
          name: `${event.title} Invitation`,
          description: 'Elegant and Professional Theme',
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

  if (viewMode === 'ai') {
    return (
      <div className="bg-card rounded-xl p-6 h-full">
        <EventAIDialog 
          event={event} 
          embedded={true} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <EventImage
        imageUrl={event.image_url}
        isEditing={isEditing}
        onImageChange={(value) => onFieldChange('image_url', value)}
      />
      <div className="flex gap-4">
        {hasInvites ? (
          <Button 
            variant="outline"
            onClick={() => navigate(`/event/${event.id}/invitations`)}
            className="flex-1"
          >
            Send Invites
          </Button>
        ) : (
          <Button 
            variant="outline"
            onClick={handleCreateInvitation}
            className="flex-1"
          >
            Create Invite
          </Button>
        )}
        <Button 
          variant="outline"
          onClick={() => navigate(`/event/${event.id}/ticketing`)}
          className="flex-1"
        >
          {hasTicketing ? 'Ticketing' : 'Add Ticketing'}
        </Button>
      </div>
    </div>
  );
};
