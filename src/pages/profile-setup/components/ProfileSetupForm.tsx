
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { User } from "@supabase/supabase-js";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { AccountTypeSection } from "./AccountTypeSection";
import { ContactInfoSection } from "./ContactInfoSection";
import { useProfileSetupForm } from "../hooks/useProfileSetupForm";

interface ProfileSetupFormProps {
  user: User | null;
}

export const ProfileSetupForm = ({ user }: ProfileSetupFormProps) => {
  const { form, isSubmitting, onSubmit } = useProfileSetupForm(user);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
          <PersonalInfoSection form={form} />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
          <AccountTypeSection form={form} />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
          <ContactInfoSection form={form} />
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full"
        >
          {isSubmitting ? "Setting Up..." : "Complete Profile Setup"}
        </Button>
      </form>
    </Form>
  );
};
