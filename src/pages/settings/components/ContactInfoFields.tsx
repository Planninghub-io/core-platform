
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactInfoFieldsProps {
  formData: {
    email: string;
    contact_number: string;
    avatar_url: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContactInfoFields = ({ formData, handleChange }: ContactInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#333333] font-medium">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          disabled
          className="border-purple-100 bg-purple-50/50 text-gray-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact_number" className="text-[#333333] font-medium">Phone Number</Label>
        <Input
          id="contact_number"
          name="contact_number"
          type="tel"
          value={formData.contact_number}
          onChange={handleChange}
          placeholder="Enter your phone number"
          className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatar_url" className="text-[#333333] font-medium">Avatar URL</Label>
        <Input
          id="avatar_url"
          name="avatar_url"
          type="url"
          value={formData.avatar_url}
          onChange={handleChange}
          placeholder="Enter your avatar URL"
          className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
        />
      </div>
    </>
  );
};
