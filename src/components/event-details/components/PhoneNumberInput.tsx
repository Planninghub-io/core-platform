
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface PhoneNumberInputProps {
  onNumbersAdd: (newNumbers: { id: string; name: string; phone: string }[]) => void;
}

export const PhoneNumberInput = ({ onNumbersAdd }: PhoneNumberInputProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validatePhoneNumber = (number: string) => {
    // Basic validation - can be enhanced based on requirements
    return number.replace(/\s+/g, "").length >= 10;
  };

  const handleAddPhone = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number");
      return;
    }

    if (!contactName.trim()) {
      setError("Please enter a contact name");
      return;
    }

    const formattedNumber = phoneNumber.replace(/\s+/g, "");
    
    onNumbersAdd([
      {
        id: `temp-${Date.now()}`,
        name: contactName,
        phone: formattedNumber
      }
    ]);

    // Reset form
    setPhoneNumber("");
    setContactName("");
    setError(null);
  };

  return (
    <div className="space-y-2 border p-3 rounded-md mb-4">
      <Label htmlFor="contact-name">Contact Name</Label>
      <Input
        id="contact-name"
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
        placeholder="Enter contact name"
      />
      
      <Label htmlFor="phone-number">Phone Number (with country code)</Label>
      <Input
        id="phone-number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="+1 (555) 123-4567"
      />
      
      {error && <p className="text-sm text-red-500">{error}</p>}
      
      <Button
        type="button"
        variant="outline"
        onClick={handleAddPhone}
        className="w-full mt-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Contact
      </Button>
    </div>
  );
};
