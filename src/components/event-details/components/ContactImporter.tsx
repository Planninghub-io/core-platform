
import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ContactImporterProps {
  onContactsImport: (contacts: { id: string; name: string; phone: string }[]) => void;
}

export const ContactImporter = ({ onContactsImport }: ContactImporterProps) => {
  const { toast } = useToast();

  const importContacts = async () => {
    // Check if the Contacts API is supported
    if ('contacts' in navigator && 'select' in navigator.contacts) {
      try {
        // Request permission to access contacts
        const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: true });
        
        if (contacts.length > 0) {
          const formattedContacts = contacts.map(contact => ({
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: contact.name?.[0] || 'Unknown',
            phone: contact.tel?.[0] || ''
          }));
          
          onContactsImport(formattedContacts);
          
          toast({
            title: "Contacts imported",
            description: `${contacts.length} contacts imported successfully`,
          });
        }
      } catch (error) {
        console.error("Error importing contacts:", error);
        toast({
          title: "Import failed",
          description: "Could not import contacts. Please check permissions.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Not supported",
        description: "Contact import is only supported on mobile devices with permission. Try adding contacts manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={importContacts} 
      variant="outline" 
      className="w-full mb-4"
    >
      <Import className="h-4 w-4 mr-2" />
      Import From Device Contacts
    </Button>
  );
};
