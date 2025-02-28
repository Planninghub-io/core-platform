
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

      const recipients = selectedContacts.map(contactId => ({
        invitation_id: invitation.id,
        contact_id: contactId,
        delivery_method: deliveryMethod,
        status: 'pending'
      }));

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
