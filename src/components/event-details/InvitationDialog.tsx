
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Mail, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

interface Invitation {
  id: string;
  event_id: string;
  template_id: string;
  status: string;
  created_at: string;
}

interface InvitationRecipient {
  id: string;
  invitation_id: string;
  contact_id: string;
  status: string;
  sent_at?: string;
  delivery_method: 'email' | 'sms';
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
        .from<'contacts', Contact>('contacts')
        .select();
      
      if (contactsError) throw contactsError;
      
      if (contactsData) {
        setContacts(contactsData);
      }

      const { data: templatesData, error: templatesError } = await supabase
        .from<'invitation_templates', InvitationTemplate>('invitation_templates')
        .select()
        .eq('event_type', eventType);
      
      if (templatesError) throw templatesError;

      if (templatesData) {
        setTemplates(templatesData);
      }
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
        .from<'invitations', Invitation>('invitations')
        .insert({
          event_id: eventId,
          template_id: selectedTemplate,
          status: "pending"
        } as Invitation)
        .select()
        .single();

      if (invitationError) throw invitationError;

      const recipients: Partial<InvitationRecipient>[] = selectedContacts.map(contactId => ({
        invitation_id: invitation.id,
        contact_id: contactId,
        delivery_method: deliveryMethod,
        status: 'pending'
      }));

      const { error: recipientsError } = await supabase
        .from<'invitation_recipients', InvitationRecipient>('invitation_recipients')
        .insert(recipients);

      if (recipientsError) throw recipientsError;

      // Send invitations using edge function
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
          <div className="space-y-4">
            <div className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedTemplate === template.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!selectedTemplate}
            >
              Continue
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Delivery Method</Label>
              <RadioGroup
                value={deliveryMethod}
                onValueChange={(value: "email" | "sms") => setDeliveryMethod(value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms" id="sms" />
                  <Label htmlFor="sms" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    SMS
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Select Contacts</Label>
              <div className="max-h-[200px] overflow-y-auto space-y-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={contact.id}
                      checked={selectedContacts.includes(contact.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedContacts([...selectedContacts, contact.id]);
                        } else {
                          setSelectedContacts(
                            selectedContacts.filter((id) => id !== contact.id)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={contact.id}>
                      {contact.name} ({deliveryMethod === "email" ? contact.email : contact.phone})
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleSendInvitations}
                disabled={isLoading || selectedContacts.length === 0}
              >
                {isLoading ? "Sending..." : "Send Invitations"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
