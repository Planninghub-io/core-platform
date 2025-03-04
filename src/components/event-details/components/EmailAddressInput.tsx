
import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface EmailAddressInputProps {
  onEmailsAdd: (emails: { id: string; name: string; email: string }[]) => void;
}

export const EmailAddressInput = ({ onEmailsAdd }: EmailAddressInputProps) => {
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const { toast } = useToast();

  const handleAddEmail = () => {
    if (!newEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(newEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    const displayName = newName.trim() || newEmail.split('@')[0];
    
    onEmailsAdd([
      {
        id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: displayName,
        email: newEmail,
      },
    ]);

    setNewEmail("");
    setNewName("");
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n");
        const emails: { id: string; name: string; email: string }[] = [];

        lines.forEach((line) => {
          const [name, email] = line.split(",").map((part) => part.trim());
          
          if (email && validateEmail(email)) {
            emails.push({
              id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              name: name || email.split('@')[0],
              email,
            });
          }
        });

        if (emails.length > 0) {
          onEmailsAdd(emails);
          toast({
            description: `Successfully imported ${emails.length} email${emails.length > 1 ? 's' : ''}`,
          });
        } else {
          toast({
            title: "Import Failed",
            description: "No valid emails found in the file",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Could not parse the CSV file",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
    // Reset the file input
    e.target.value = "";
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="space-y-4 mb-4 p-3 border rounded-md">
      <h3 className="font-medium text-sm">Add Recipients</h3>

      <div className="grid grid-cols-1 gap-2">
        <div>
          <Label htmlFor="new-name">Name (optional)</Label>
          <Input
            id="new-name"
            placeholder="John Doe"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="new-email">Email Address</Label>
          <div className="flex gap-2">
            <Input
              id="new-email"
              placeholder="john@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddEmail();
                }
              }}
            />
            <Button onClick={handleAddEmail} className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm text-muted-foreground mb-2">Or import from CSV file (name,email format)</div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => document.getElementById("csv-upload")?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImportCSV}
          />
        </div>
      </div>
    </div>
  );
};
