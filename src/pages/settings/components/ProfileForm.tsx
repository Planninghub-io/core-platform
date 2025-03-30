import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile } from "@/types/user";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ProfileFormProps {
  userProfile: UserProfile;
  refreshUserProfile: () => Promise<void>;
}

// Create a schema for form validation
const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_name: z.string().optional(),
  name_suffix: z.string().optional(),
  email: z.string().email().optional(),
  contact_number: z.string().optional(),
  dob: z.string().optional(),
  avatar_url: z.string().optional()
});

export const ProfileForm = ({ userProfile, refreshUserProfile }: ProfileFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof profileSchema>>({
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

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#333333] font-medium">First Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your first name"
                      className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
                    />
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
                    <Input
                      {...field}
                      placeholder="Enter your last name"
                      className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
                    />
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
                  <Input
                    type="date"
                    {...field}
                    className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
                  />
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
                  <Input
                    {...field}
                    placeholder="Enter your contact number"
                    className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
                  />
                </FormControl>
              </FormItem>
            )}
          />
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
