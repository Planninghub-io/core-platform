
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../../hooks/useProfileForm";
import { FormField } from "./FormField";
import { User, Calendar } from "lucide-react";

interface PersonalInfoSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const PersonalInfoSection = ({ form }: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          form={form}
          name="first_name"
          label="First Name"
          placeholder="Enter your first name"
          icon={User}
          required={true}
        />
        <FormField
          form={form}
          name="middle_name"
          label="Middle Name"
          placeholder="Enter your middle name"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          form={form}
          name="last_name"
          label="Last Name"
          placeholder="Enter your last name"
          icon={User}
          required={true}
        />
        <FormField
          form={form}
          name="name_suffix"
          label="Suffix"
          placeholder="Enter name suffix (e.g., Jr., Sr.)"
        />
      </div>
      <FormField
        form={form}
        name="dob"
        label="Date of Birth"
        type="date"
        icon={Calendar}
      />
    </div>
  );
};
