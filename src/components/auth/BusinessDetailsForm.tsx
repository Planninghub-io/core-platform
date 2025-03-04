
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Phone } from "lucide-react";

interface BusinessDetailsFormProps {
  companyName: string;
  businessEmail: string; // We'll use this for display only now
  businessPhone: string;
  onCompanyNameChange: (value: string) => void;
  onBusinessEmailChange: (value: string) => void; // Keep for interface compatibility
  onBusinessPhoneChange: (value: string) => void;
}

const BusinessDetailsForm = ({
  companyName,
  businessEmail,
  businessPhone,
  onCompanyNameChange,
  onBusinessPhoneChange,
}: BusinessDetailsFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <div className="relative">
          <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            placeholder="Your Company Name"
            className="pl-9"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="businessPhone">Business Phone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="businessPhone"
            type="tel"
            value={businessPhone}
            onChange={(e) => onBusinessPhoneChange(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="pl-9"
            required
          />
        </div>
      </div>
    </>
  );
};

export default BusinessDetailsForm;
