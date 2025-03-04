
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "../types";

export const useInvitationPreview = (
  isOpen: boolean,
  themeDescription: string,
  eventDetails: Event | null,
  editableTitle: string,
  editableDescription: string,
  editableInviteText: string,
  isEditingContent: boolean
) => {
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && eventDetails && themeDescription !== undefined) {
      generatePreview();
    }
  }, [isOpen, themeDescription, eventDetails]);

  const generatePreview = async () => {
    if (!eventDetails) return;
    
    setIsLoading(true);
    try {
      // Create a copy of event details with editable content if user is editing
      const eventDetailsCopy = {
        ...eventDetails,
        title: isEditingContent ? editableTitle : eventDetails.title,
        description: isEditingContent ? editableDescription : eventDetails.description,
        inviteText: isEditingContent ? editableInviteText : "You are cordially invited to"
      };

      const { data, error } = await supabase.functions.invoke(
        'generate-invitation',
        {
          body: { 
            eventDetails: eventDetailsCopy,
            theme: themeDescription || 'elegant and professional'
          }
        }
      );

      if (error) throw error;
      setPreviewHtml(data.template);
      
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    previewHtml,
    isLoading,
    generatePreview
  };
};
