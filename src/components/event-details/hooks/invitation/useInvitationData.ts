
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Contact, InvitationTemplate } from "../../types/invitation-dialog";
import { fetchContacts, fetchEventTemplates, fetchGenericTemplates } from "./invitationAPI";

export function useInvitationData(isOpen: boolean, eventId: string, eventType: string) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, eventId]);

  const fetchData = async () => {
    try {
      // Fetch contacts
      const contactsData = await fetchContacts();
      setContacts(contactsData);

      // Try to get event-specific templates first
      const eventTemplates = await fetchEventTemplates(eventId);
      
      if (eventTemplates && eventTemplates.length > 0) {
        setTemplates(eventTemplates);
      } else {
        // Fall back to generic templates
        const genericTemplates = await fetchGenericTemplates(eventType);
        setTemplates(genericTemplates);
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

  return { contacts, templates };
}
