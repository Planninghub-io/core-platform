
import { useState } from "react";
import { Contact } from "../types/invitation-dialog";
import { EmailAddressInput } from "./EmailAddressInput";
import { DeliveryMethodSelector } from "./contact/DeliveryMethodSelector";
import { ContactList } from "./contact/ContactList";
import { ContactSelectorActions } from "./contact/ContactSelectorActions";

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
  
  const allContacts = [...contacts, ...tempContacts];
  const filteredContacts = allContacts.filter(contact => 
    deliveryMethod === "email" ? !!contact.email : !!contact.phone
  );

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
      <DeliveryMethodSelector 
        value={deliveryMethod}
        onChange={onDeliveryMethodChange}
      />

      {deliveryMethod === "email" && (
        <EmailAddressInput onEmailsAdd={handleAddEmails} />
      )}

      <ContactList
        contacts={filteredContacts}
        selectedContacts={selectedContacts}
        deliveryMethod={deliveryMethod}
        onContactSelect={onContactSelect}
      />

      <ContactSelectorActions
        onBack={onBack}
        onSend={onSend}
        isLoading={isLoading}
        disabled={selectedContacts.length === 0}
      />
    </div>
  );
};
