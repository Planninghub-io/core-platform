
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Contact } from "../../types/invitation-dialog";

interface ContactListProps {
  contacts: Contact[];
  selectedContacts: string[];
  deliveryMethod: "email" | "sms";
  onContactSelect: (contacts: string[]) => void;
}

export const ContactList = ({
  contacts,
  selectedContacts,
  deliveryMethod,
  onContactSelect,
}: ContactListProps) => {
  const handleContactToggle = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      onContactSelect(selectedContacts.filter((id) => id !== contactId));
    } else {
      onContactSelect([...selectedContacts, contactId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      onContactSelect([]);
    } else {
      onContactSelect(contacts.map(contact => contact.id));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Select Contacts</Label>
        {contacts.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSelectAll} 
            className="text-xs h-7"
          >
            {selectedContacts.length === contacts.length ? "Deselect All" : "Select All"}
          </Button>
        )}
      </div>
      
      <div className="max-h-[200px] overflow-y-auto space-y-2 border rounded-md p-2">
        {contacts.length === 0 ? (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mr-2" />
            No contacts with {deliveryMethod === "email" ? "email addresses" : "phone numbers"}
          </div>
        ) : (
          contacts.map((contact) => (
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
  );
};
