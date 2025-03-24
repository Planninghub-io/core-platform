
import { supabase } from "@/integrations/supabase/client";
import { Contact, InvitationTemplate } from "../../types/invitation-dialog";

// Fetch contacts from Supabase
export const fetchContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .returns<Contact[]>();
  
  if (error) throw error;
  return data || [];
};

// Fetch invitation templates for a specific event
export const fetchEventTemplates = async (eventId: string) => {
  // First get the template IDs used for this event
  const { data: eventInvitations, error: invitationsError } = await supabase
    .from('invitations')
    .select('template_id')
    .eq('event_id', eventId);
  
  if (invitationsError) throw invitationsError;
  
  // If we have event-specific templates, query them
  if (eventInvitations && eventInvitations.length > 0) {
    const templateIds = eventInvitations.map(inv => inv.template_id);
    
    const { data: eventTemplates, error: templatesError } = await supabase
      .from('invitation_templates')
      .select('*')
      .in('id', templateIds)
      .returns<InvitationTemplate[]>();
    
    if (templatesError) throw templatesError;
    
    if (eventTemplates && eventTemplates.length > 0) {
      return eventTemplates;
    }
  }
  
  return null;
};

// Fetch generic templates for an event type
export const fetchGenericTemplates = async (eventType: string) => {
  const { data: genericTemplates, error: templatesError } = await supabase
    .from('invitation_templates')
    .select('*')
    .eq('event_type', eventType)
    .returns<InvitationTemplate[]>();
  
  if (templatesError) throw templatesError;
  
  return genericTemplates || [];
};

// Get current authenticated user session
export const getCurrentUserSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

// Create a new invitation
export const createInvitation = async (eventId: string, templateId: string) => {
  const { data, error } = await supabase
    .from('invitations')
    .insert({
      event_id: eventId,
      template_id: templateId,
      status: "pending"
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Insert recipients for an invitation
export const insertRecipients = async (recipients: any[]) => {
  if (!recipients || recipients.length === 0) {
    throw new Error("No recipients provided");
  }
  
  const { error } = await supabase
    .from('invitation_recipients')
    .insert(recipients);

  if (error) throw error;
};

// Send invitations using Supabase edge function
export const sendInvitations = async (invitationId: string) => {
  try {
    const { error } = await supabase.functions.invoke("send-invitations", {
      body: { invitationId }
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error invoking send-invitations function:", error);
    throw error;
  }
};

// Create temporary contacts
export const createTempContacts = async (tempContactsToAdd: any[]) => {
  if (!tempContactsToAdd || tempContactsToAdd.length === 0) {
    throw new Error("No contacts to add");
  }
  
  const { data, error } = await supabase
    .from('contacts')
    .insert(tempContactsToAdd)
    .select();
  
  if (error) throw error;
  return data;
};
