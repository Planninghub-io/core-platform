
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TemplateSelector } from "./components/TemplateSelector";
import { ContactSelector } from "./components/ContactSelector";

interface Contact {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  created_at: string;
}

interface InvitationTemplate {
  id: string;
  name: string;
  description?: string;
  event_type: string;
  template_html: string;
  created_at: string;
}

interface InvitationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventType: string;
}

export const InvitationDialog = ({ isOpen, onClose, eventId, eventType }: InvitationDialogProps) => {
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
  }, [isOpen]);

  const fetchData = async () => {
    try {
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
      onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Invitations</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Choose an invitation template" : "Select recipients and delivery method"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <TemplateSelector
            templates={templates}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={setSelectedTemplate}
            onContinue={() => setStep(2)}
          />
        ) : (
          <ContactSelector
            contacts={contacts}
            selectedContacts={selectedContacts}
            deliveryMethod={deliveryMethod}
            onDeliveryMethodChange={setDeliveryMethod}
            onContactSelect={setSelectedContacts}
            onBack={() => setStep(1)}
            onSend={handleSendInvitations}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
