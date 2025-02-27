
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoFieldsProps {
  formData: {
    first_name: string;
    middle_name: string;
    last_name: string;
    name_suffix: string;
    dob: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PersonalInfoFields = ({ formData, handleChange }: PersonalInfoFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name" className="text-[#333333] font-medium">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Enter your first name"
            className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="middle_name" className="text-[#333333] font-medium">Middle Name</Label>
          <Input
            id="middle_name"
            name="middle_name"
            value={formData.middle_name}
            onChange={handleChange}
            placeholder="Enter your middle name"
            className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="last_name" className="text-[#333333] font-medium">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Enter your last name"
            className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name_suffix" className="text-[#333333] font-medium">Suffix</Label>
          <Input
            id="name_suffix"
            name="name_suffix"
            value={formData.name_suffix}
            onChange={handleChange}
            placeholder="Enter name suffix (e.g., Jr., Sr.)"
            className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dob" className="text-[#333333] font-medium">Date of Birth</Label>
        <Input
          id="dob"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
        />
      </div>
    </>
  );
};
