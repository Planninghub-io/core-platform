
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Mail, Phone } from "lucide-react";

interface BusinessDetailsFormProps {
  companyName: string;
  businessEmail: string;
  businessPhone: string;
  onCompanyNameChange: (value: string) => void;
  onBusinessEmailChange: (value: string) => void;
  onBusinessPhoneChange: (value: string) => void;
}

const BusinessDetailsForm = ({
  companyName,
  businessEmail,
  businessPhone,
  onCompanyNameChange,
  onBusinessEmailChange,
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
        <Label htmlFor="businessEmail">Business Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="businessEmail"
            type="email"
            value={businessEmail}
            onChange={(e) => onBusinessEmailChange(e.target.value)}
            placeholder="contact@company.com"
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
