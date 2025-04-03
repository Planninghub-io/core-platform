
import { UseFormReturn } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProfileFormValues } from "../schema";

interface AccountTypeSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const AccountTypeSection = ({ form }: AccountTypeSectionProps) => {
  const accountType = form.watch("account_type");
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Account Type</Label>
        <RadioGroup 
          value={accountType} 
          onValueChange={(value) => form.setValue("account_type", value as "individual" | "company")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual">Individual</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="company" id="company" />
            <Label htmlFor="company">Company</Label>
          </div>
        </RadioGroup>
      </div>
      
      {accountType === "company" && (
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <div className="relative">
            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="company_name"
              {...form.register("company_name")}
              placeholder="Enter your company name"
              className="pl-9"
            />
          </div>
        </div>
      )}
    </div>
  );
};
