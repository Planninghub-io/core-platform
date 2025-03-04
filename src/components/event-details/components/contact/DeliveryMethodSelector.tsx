
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, MessageSquare } from "lucide-react";

interface DeliveryMethodSelectorProps {
  value: "email" | "sms";
  onChange: (value: "email" | "sms") => void;
}

export const DeliveryMethodSelector = ({
  value,
  onChange,
}: DeliveryMethodSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Delivery Method</Label>
      <RadioGroup
        value={value}
        onValueChange={(value) => onChange(value as "email" | "sms")}
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
  );
};
