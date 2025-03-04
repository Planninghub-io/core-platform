
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contact, InvitationTemplate } from "../types/invitation-dialog";

export function useInvitationDialog(isOpen: boolean, eventId: string, eventType: string) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "sms">("email");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, eventId]);

  useEffect(() => {
    // Reset state when dialog is opened
    if (isOpen) {
      setStep(1);
      setSelectedTemplate("");
      setSelectedContacts([]);
      setDeliveryMethod("email");
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .returns<Contact[]>();
      
      if (contactsError) throw contactsError;
      
      if (contactsData) {
        setContacts(contactsData);
      }

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
          setTemplates(eventTemplates);
          return;
        }
      }
      
      // If no event-specific templates found, fall back to generic templates
      const { data: genericTemplates, error: templatesError } = await supabase
        .from('invitation_templates')
        .select('*')
        .eq('event_type', eventType)
        .returns<InvitationTemplate[]>();
      
      if (templatesError) throw templatesError;
      
      setTemplates(genericTemplates || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load contacts and templates",
        variant: "destructive",
      });
    }
  };

  const handleSendInvitations = async () => {
    if (!selectedTemplate || selectedContacts.length === 0) {
      toast({
        title: "Error",
        description: "Please select a template and at least one contact",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Separate permanent contacts from temporary ones
      const permanentContactIds = selectedContacts.filter(id => !id.startsWith("temp-"));
      const tempContactIds = selectedContacts.filter(id => id.startsWith("temp-"));
      
      // Create the invitation
      const { data: invitation, error: invitationError } = await supabase
        .from('invitations')
        .insert({
          event_id: eventId,
          template_id: selectedTemplate,
          status: "pending"
        })
        .select()
        .single();

      if (invitationError) throw invitationError;

      // Prepare recipients array for permanent contacts
      let recipients = permanentContactIds.map(contactId => ({
        invitation_id: invitation.id,
        contact_id: contactId,
        delivery_method: deliveryMethod,
        status: 'pending'
      }));
      
      // Add temporary contacts to the contacts table first
      if (tempContactIds.length > 0) {
        const tempContactsToAdd = tempContactIds.map(id => {
          const contact = contacts.find(c => c.id === id) || 
                          { id, name: "", email: "", phone: "", user_id: "", created_at: "" };
          
          // Get current user's ID or use a placeholder
          const { data } = supabase.auth.getSession();
          
          return {
            name: contact.name,
            email: contact.email,
            phone: contact.phone || null,
            user_id: data?.session?.user?.id || 'temp-user'
          };
        });
        
        const { data: addedContacts, error: contactsError } = await supabase
          .from('contacts')
          .insert(tempContactsToAdd)
          .select()
          .returns<Contact[]>();
        
        if (contactsError) throw contactsError;
        
        // Add new permanent contacts to recipients
        if (addedContacts) {
          const newRecipients = addedContacts.map(contact => ({
            invitation_id: invitation.id,
            contact_id: contact.id,
            delivery_method: deliveryMethod,
            status: 'pending'
          }));
          
          recipients = [...recipients, ...newRecipients];
        }
      }

      const { error: recipientsError } = await supabase
        .from('invitation_recipients')
        .insert(recipients);

      if (recipientsError) throw recipientsError;

      const { error: sendError } = await supabase.functions.invoke("send-invitations", {
        body: { invitationId: invitation.id }
      });

      if (sendError) throw sendError;

      toast({
        title: "Success",
        description: "Invitations sent successfully",
      });
    } catch (error) {
      console.error("Error sending invitations:", error);
      toast({
        title: "Error",
        description: "Failed to send invitations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    setStep,
    selectedTemplate,
    setSelectedTemplate,
    selectedContacts,
    setSelectedContacts,
    deliveryMethod,
    setDeliveryMethod,
    contacts,
    templates,
    isLoading,
    handleSendInvitations
  };
}

