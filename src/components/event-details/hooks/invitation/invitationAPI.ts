
import { supabase } from "@/integrations/supabase/client";
import { Contact, InvitationTemplate } from "../../types/invitation-dialog";
import { ensureUUID, asTableRow, safelyExtractData, safelyExtractSingleRow } from "@/utils/supabaseHelpers";

// Fetch contacts from Supabase
export const fetchContacts = async (): Promise<Contact[]> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*');
    
    return safelyExtractData<Contact>(data, error);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
};

// Fetch invitation templates for a specific event
export const fetchEventTemplates = async (eventId: string): Promise<InvitationTemplate[] | null> => {
  try {
    // First get the template IDs used for this event
    const { data: eventInvitations, error: invitationsError } = await supabase
      .from('invitations')
      .select('template_id')
      .eq('event_id', ensureUUID(eventId));
    
    if (invitationsError) throw invitationsError;
    
    // If we have event-specific templates, query them
    if (eventInvitations && eventInvitations.length > 0) {
      // Safely extract template IDs with type checking
      const templateIds = eventInvitations
        .filter(inv => inv && typeof inv === 'object' && 'template_id' in inv && inv.template_id)
        .map(inv => inv.template_id);
      
      if (templateIds.length === 0) return null;
      
      const { data: eventTemplates, error: templatesError } = await supabase
        .from('invitation_templates')
        .select('*')
        .in('id', templateIds);
      
      return safelyExtractData<InvitationTemplate>(eventTemplates, templatesError);
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching event templates:", error);
    return null;
  }
};

// Fetch generic templates for an event type
export const fetchGenericTemplates = async (eventType: string): Promise<InvitationTemplate[]> => {
  try {
    const { data: genericTemplates, error: templatesError } = await supabase
      .from('invitation_templates')
      .select('*')
      .eq('event_type', ensureUUID(eventType));
    
    return safelyExtractData<InvitationTemplate>(genericTemplates, templatesError);
  } catch (error) {
    console.error("Error fetching generic templates:", error);
    return [];
  }
};

// Get current authenticated user session
export const getCurrentUserSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error("Error getting user session:", error);
    return null;
  }
};

// Create a new invitation
export const createInvitation = async (eventId: string, templateId: string) => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .insert({
        event_id: ensureUUID(eventId),
        template_id: ensureUUID(templateId),
        status: "pending"
      } as any) // Use type assertion to bypass TypeScript's strict typing
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("No data returned from invitation creation");
    
    return asTableRow(data);
  } catch (error) {
    console.error("Error creating invitation:", error);
    throw error;
  }
};

// Insert recipients for an invitation
export const insertRecipients = async (recipients: any[]) => {
  try {
    if (!recipients || recipients.length === 0) {
      throw new Error("No recipients provided");
    }
    
    const { error } = await supabase
      .from('invitation_recipients')
      .insert(recipients as any); // Use type assertion

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error inserting recipients:", error);
    throw error;
  }
};

// Send invitations using Supabase edge function
export const sendInvitations = async (invitationId: string) => {
  try {
    const { error } = await supabase.functions.invoke("send-invitations", {
      body: { invitationId }
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error invoking send-invitations function:", error);
    throw error;
  }
};

// Create temporary contacts
export const createTempContacts = async (tempContactsToAdd: any[]) => {
  try {
    if (!tempContactsToAdd || tempContactsToAdd.length === 0) {
      throw new Error("No contacts to add");
    }
    
    const { data, error } = await supabase
      .from('contacts')
      .insert(tempContactsToAdd as any) // Use type assertion
      .select();
    
    return safelyExtractData(data, error);
  } catch (error) {
    console.error("Error creating temp contacts:", error);
    throw error;
  }
};
