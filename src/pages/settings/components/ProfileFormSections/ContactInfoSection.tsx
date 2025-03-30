
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../../hooks/useProfileForm";
import { FormField } from "./FormField";
import { Mail, Phone } from "lucide-react";

interface ContactInfoSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const ContactInfoSection = ({ form }: ContactInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <FormField
        form={form}
        name="email"
        label="Email"
        icon={Mail}
        disabled={true}
      />
      <FormField
        form={form}
        name="contact_number"
        label="Contact Number"
        placeholder="Enter your contact number"
        icon={Phone}
      />
      <FormField
        form={form}
        name="avatar_url"
        label="Avatar URL"
        placeholder="Enter your avatar URL"
      />
    </div>
  );
};
