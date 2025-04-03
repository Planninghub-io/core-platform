
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Home, Phone } from "lucide-react";
import { ProfileFormValues } from "../schema";

interface ContactInfoSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const ContactInfoSection = ({ form }: ContactInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <div className="relative">
          <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="address"
            {...form.register("address")}
            placeholder="Enter your address"
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contact_number">Contact Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="contact_number"
            {...form.register("contact_number")}
            placeholder="Enter your contact number"
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Contact Type</Label>
        <RadioGroup 
          value={form.watch("contact_type")} 
          onValueChange={(value) => form.setValue("contact_type", value as "business" | "mobile")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mobile" id="mobile" />
            <Label htmlFor="mobile">Mobile</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="business" id="business" />
            <Label htmlFor="business">Business Phone</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
