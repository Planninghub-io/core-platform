
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/user";
import { Form } from "@/components/ui/form";
import { useProfileForm } from "../hooks/useProfileForm";
import { PersonalInfoSection, ContactInfoSection } from "./ProfileFormSections";

interface ProfileFormProps {
  userProfile: UserProfile;
  refreshUserProfile: () => Promise<void>;
}

export const ProfileForm = ({ userProfile, refreshUserProfile }: ProfileFormProps) => {
  const { form, isSubmitting, onSubmit } = useProfileForm(userProfile, refreshUserProfile);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-purple-900 mb-4">Personal Information</h3>
            <PersonalInfoSection form={form} />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-purple-900 mb-4">Contact Information</h3>
            <ContactInfoSection form={form} />
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting || !form.formState.isDirty}
          className="bg-[#8b73f4] hover:bg-[#8b73f4]/90 text-white"
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
};
