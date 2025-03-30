
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";

// Profile schema for form validation
export const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_name: z.string().optional(),
  name_suffix: z.string().optional(),
  email: z.string().email().optional(),
  contact_number: z.string().optional(),
  dob: z.string().optional(),
  avatar_url: z.string().optional()
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export function useProfileForm(userProfile: UserProfile, refreshUserProfile: () => Promise<void>) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form with react-hook-form and zod validation
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: userProfile.first_name || "",
      middle_name: userProfile.middle_name || "",
      last_name: userProfile.last_name || "",
      name_suffix: userProfile.name_suffix || "",
      email: userProfile.email || "",
      contact_number: userProfile.contact_number || "",
      dob: userProfile.dob ? new Date(userProfile.dob).toISOString().split('T')[0] : "",
      avatar_url: userProfile.avatar_url || ""
    }
  });
  
  // Update form when userProfile changes
  useEffect(() => {
    if (userProfile) {
      form.reset({
        first_name: userProfile.first_name || "",
        middle_name: userProfile.middle_name || "",
        last_name: userProfile.last_name || "",
        name_suffix: userProfile.name_suffix || "",
        email: userProfile.email || "",
        contact_number: userProfile.contact_number || "",
        dob: userProfile.dob ? new Date(userProfile.dob).toISOString().split('T')[0] : "",
        avatar_url: userProfile.avatar_url || ""
      });
    }
  }, [userProfile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Format the data before sending to Supabase
      const updateData = {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        name_suffix: data.name_suffix,
        contact_number: data.contact_number,
        dob: data.dob || null,
        avatar_url: data.avatar_url
      };

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      // Wait for the refresh to complete
      await refreshUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
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
}
