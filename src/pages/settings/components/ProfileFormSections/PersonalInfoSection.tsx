
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../../hooks/useProfileForm";

interface PersonalInfoSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const PersonalInfoSection = ({ form }: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#333333] font-medium">First Name *</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...field}
                    placeholder="Enter your first name"
                    className="border-purple-100 pl-9 focus-visible:ring-[#8b73f4]/20"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="middle_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#333333] font-medium">Middle Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your middle name"
                  className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#333333] font-medium">Last Name *</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...field}
                    placeholder="Enter your last name"
                    className="border-purple-100 pl-9 focus-visible:ring-[#8b73f4]/20"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name_suffix"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#333333] font-medium">Suffix</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter name suffix (e.g., Jr., Sr.)"
                  className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="dob"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#333333] font-medium">Date of Birth</FormLabel>
            <FormControl>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  {...field}
                  className="border-purple-100 pl-9 focus-visible:ring-[#8b73f4]/20"
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
