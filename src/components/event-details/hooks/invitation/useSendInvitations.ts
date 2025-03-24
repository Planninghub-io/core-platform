
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Contact } from "../../types/invitation-dialog";
import { 
  createInvitation, 
  insertRecipients, 
  sendInvitations, 
  getCurrentUserSession, 
  createTempContacts 
} from "./invitationAPI";

export function useSendInvitations(eventId: string, contacts: Contact[]) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendInvitations = async (
    selectedTemplate: string,
    selectedContacts: string[],
    deliveryMethod: "email" | "sms"
  ) => {
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
      const invitation = await createInvitation(eventId, selectedTemplate);

      // Prepare recipients array for permanent contacts
      let recipients = permanentContactIds.map(contactId => ({
        invitation_id: invitation.id,
        contact_id: contactId,
        delivery_method: deliveryMethod,
        status: 'pending'
      }));
      
      // Add temporary contacts to the contacts table first
      if (tempContactIds.length > 0) {
        // Get current user's ID
        const session = await getCurrentUserSession();
        const userId = session?.user?.id || 'temp-user';

        const tempContactsToAdd = tempContactIds.map(id => {
          const contact = contacts.find(c => c.id === id);
          if (!contact) {
            throw new Error(`Contact not found with id ${id}`);
          }
          
          return {
            name: contact.name || 'Unknown',
            email: contact.email || null,
            phone: contact.phone || null,
            user_id: userId
          };
        });
        
        const addedContacts = await createTempContacts(tempContactsToAdd);
        
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

      if (recipients.length === 0) {
        throw new Error("No valid recipients found");
      }

      await insertRecipients(recipients);
      await sendInvitations(invitation.id);

      toast({
        title: "Success",
        description: "Invitations sent successfully",
      });
    } catch (error) {
      console.error("Error sending invitations:", error);
      toast({
        title: "Error",
        description: "Failed to send invitations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleSendInvitations };
}
