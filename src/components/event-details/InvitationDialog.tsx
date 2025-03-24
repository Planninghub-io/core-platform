
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TemplateSelector } from "./components/TemplateSelector";
import { ContactSelector } from "./components/ContactSelector";
import { useInvitationDialog } from "./hooks/useInvitationDialog";
import { InvitationDialogProps } from "./types/invitation-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const InvitationDialog = ({ isOpen, onClose, eventId, eventType }: InvitationDialogProps) => {
  const {
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
  } = useInvitationDialog(isOpen, eventId, eventType);

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
          <>
            {/* Only show back button in template step */}
            <div className="mb-4">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="px-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to templates
              </Button>
            </div>
            <ContactSelector
              contacts={contacts}
              selectedContacts={selectedContacts}
              deliveryMethod={deliveryMethod}
              onDeliveryMethodChange={setDeliveryMethod}
              onContactSelect={setSelectedContacts}
              onSend={handleSendInvitations}
              isLoading={isLoading}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
