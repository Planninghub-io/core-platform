
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, AlertCircle } from "lucide-react";
import { Contact } from "../types/invitation-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { EmailAddressInput } from "./EmailAddressInput";

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
  const [tempContacts, setTempContacts] = useState<Contact[]>([]);
  
  // Filter contacts based on delivery method to only show those with appropriate contact info
  const allContacts = [...contacts, ...tempContacts];
  const filteredContacts = allContacts.filter(contact => 
    deliveryMethod === "email" ? !!contact.email : !!contact.phone
  );

  const handleContactToggle = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      onContactSelect(selectedContacts.filter((id) => id !== contactId));
    } else {
      onContactSelect([...selectedContacts, contactId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      onContactSelect([]);
    } else {
      onContactSelect(filteredContacts.map(contact => contact.id));
    }
  };

  const handleAddEmails = (newEmails: { id: string; name: string; email: string }[]) => {
    const newContacts = newEmails.map(item => ({
      id: item.id,
      user_id: "temp",
      name: item.name,
      email: item.email,
      created_at: new Date().toISOString()
    }));
    
    setTempContacts(prev => [...prev, ...newContacts]);
    onContactSelect([...selectedContacts, ...newContacts.map(c => c.id)]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Delivery Method</Label>
        <RadioGroup
          value={deliveryMethod}
          onValueChange={(value) => onDeliveryMethodChange(value as "email" | "sms")}
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

      {deliveryMethod === "email" && (
        <EmailAddressInput onEmailsAdd={handleAddEmails} />
      )}

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Select Contacts</Label>
          {filteredContacts.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSelectAll} 
              className="text-xs h-7"
            >
              {selectedContacts.length === filteredContacts.length ? "Deselect All" : "Select All"}
            </Button>
          )}
        </div>
        
        <div className="max-h-[200px] overflow-y-auto space-y-2 border rounded-md p-2">
          {filteredContacts.length === 0 ? (
            <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 mr-2" />
              No contacts with {deliveryMethod === "email" ? "email addresses" : "phone numbers"}
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center space-x-2 py-1 px-2 hover:bg-accent rounded"
              >
                <Checkbox
                  id={contact.id}
                  checked={selectedContacts.includes(contact.id)}
                  onCheckedChange={() => handleContactToggle(contact.id)}
                />
                <Label htmlFor={contact.id} className="cursor-pointer flex-1">
                  {contact.name} 
                  <span className="text-sm text-muted-foreground ml-2">
                    ({deliveryMethod === "email" ? contact.email : contact.phone})
                  </span>
                </Label>
              </div>
            ))
          )}
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
