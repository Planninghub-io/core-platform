
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { UserProfile } from "@/types/user";

const profileFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_name: z.string().optional().nullable(),
  name_suffix: z.string().optional().nullable(),
  contact_number: z.string().optional().nullable(),
  dob: z.string().optional().nullable(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const useProfileForm = (userProfile: UserProfile, refreshUserProfile: () => Promise<void>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: userProfile.first_name || '',
      last_name: userProfile.last_name || '',
      middle_name: userProfile.middle_name || '',
      name_suffix: userProfile.name_suffix || '',
      contact_number: userProfile.contact_number || '',
      dob: userProfile.dob || '',
    }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          middle_name: data.middle_name || null,
          name_suffix: data.name_suffix || null,
          contact_number: data.contact_number || null,
          dob: data.dob || null,
        })
        .eq('id', supabase.auth.getSession().then(({ data }) => data.session?.user.id));

      if (error) throw error;

      toast.success("Profile updated successfully");
      await refreshUserProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit
  };
};
