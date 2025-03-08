
import { supabase } from "@/integrations/supabase/client";

export const useInvitationCreation = () => {
  const createDefaultInvitation = async (
    eventId: string, 
    eventTitle: string, 
    eventDescription: string, 
    eventDate: string, 
    eventLocation: string, 
    eventBudget: string,
    budgetCurrency: string
  ) => {
    try {
      // Format the budget with currency
      const budget = eventBudget ? 
        `${budgetCurrency} ${parseFloat(eventBudget).toFixed(2)}` : 
        '';

      // First, create a default template
      const { data: templateData, error: templateError } = await supabase
        .from('invitation_templates')
        .insert({
          name: `${eventTitle} Invitation`,
          description: 'Default template for your event',
          event_type: 'default',
          template_html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
              <h1 style="color: #333;">${eventTitle}</h1>
              <p style="color: #666;">${eventDescription || 'Join us for this special event!'}</p>
              <div style="margin: 20px 0;">
                <p><strong>Date:</strong> ${new Date(eventDate).toLocaleString()}</p>
                <p><strong>Location:</strong> ${eventLocation || 'TBD'}</p>
                ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
              </div>
              <div style="margin-top: 30px; text-align: center;">
                <a href="#" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">RSVP Now</a>
              </div>
            </div>
          `
        })
        .select()
        .single();

      if (templateError) {
        console.error('Error creating template:', templateError);
        return;
      }

      // Then create an invitation with this template
      const { error: invitationError } = await supabase
        .from('invitations')
        .insert({
          event_id: eventId,
          template_id: templateData.id,
          status: 'draft'
        });

      if (invitationError) {
        console.error('Error creating invitation:', invitationError);
      }
    } catch (error) {
      console.error('Error in createDefaultInvitation:', error);
    }
  };

  return {
    createDefaultInvitation
  };
};
