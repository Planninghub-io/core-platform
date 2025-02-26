
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare } from "lucide-react";

interface Contact {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  created_at: string;
}

interface ContactSelectorProps {
  contacts: Contact[];
  selectedContacts: string[];
  deliveryMethod: "email" | "sms";
  onDeliveryMethodChange: (method: "email" | "sms") => void;
  onContactSelect: (contacts: string[]) => void;
  onBack: () => void;
  onSend: () => void;
  isLoading: boolean;
}

export const ContactSelector = ({
  contacts,
  selectedContacts,
  deliveryMethod,
  onDeliveryMethodChange,
  onContactSelect,
  onBack,
  onSend,
  isLoading,
}: ContactSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Delivery Method</Label>
        <RadioGroup
          value={deliveryMethod}
          onValueChange={onDeliveryMethodChange}
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
                    onContactSelect([...selectedContacts, contact.id]);
                  } else {
                    onContactSelect(
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
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          className="flex-1"
          onClick={onSend}
          disabled={isLoading || selectedContacts.length === 0}
        >
          {isLoading ? "Sending..." : "Send Invitations"}
        </Button>
      </div>
    </div>
  );
};
