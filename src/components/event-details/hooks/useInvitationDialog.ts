
import { useState, useEffect } from "react";
import { useInvitationData } from "./invitation/useInvitationData";
import { useSendInvitations } from "./invitation/useSendInvitations";

export function useInvitationDialog(isOpen: boolean, eventId: string, eventType: string) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "sms">("email");
  
  const { contacts, templates } = useInvitationData(isOpen, eventId, eventType);
  const { isLoading, handleSendInvitations } = useSendInvitations(eventId, contacts);

  useEffect(() => {
    // Reset state when dialog is opened
    if (isOpen) {
      setStep(1);
      setSelectedTemplate("");
      setSelectedContacts([]);
      setDeliveryMethod("email");
    }
  }, [isOpen]);

  const sendInvitations = async () => {
    await handleSendInvitations(selectedTemplate, selectedContacts, deliveryMethod);
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
    handleSendInvitations: sendInvitations
  };
}
