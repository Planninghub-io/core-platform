
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Phone } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../../hooks/useProfileForm";

interface ContactInfoSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const ContactInfoSection = ({ form }: ContactInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#333333] font-medium">Email</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...field}
                  disabled
                  className="border-purple-100 pl-9 bg-purple-50/50 text-gray-500"
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contact_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#333333] font-medium">Contact Number</FormLabel>
            <FormControl>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...field}
                  placeholder="Enter your contact number"
                  className="border-purple-100 pl-9 focus-visible:ring-[#8b73f4]/20"
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="avatar_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#333333] font-medium">Avatar URL</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Enter your avatar URL"
                className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
