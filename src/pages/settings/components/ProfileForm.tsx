
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile } from "@/types/user";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";

interface ProfileFormProps {
  userProfile: UserProfile;
  refreshUserProfile: () => Promise<void>;
}

export const ProfileForm = ({ userProfile, refreshUserProfile }: ProfileFormProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: userProfile.first_name || "",
    middle_name: userProfile.middle_name || "",
    last_name: userProfile.last_name || "",
    name_suffix: userProfile.name_suffix || "",
    email: userProfile.email || "",
    contact_number: userProfile.contact_number || "",
    dob: userProfile.dob ? new Date(userProfile.dob).toISOString().split('T')[0] : "",
    avatar_url: userProfile.avatar_url || ""
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || "",
        middle_name: userProfile.middle_name || "",
        last_name: userProfile.last_name || "",
        name_suffix: userProfile.name_suffix || "",
        email: userProfile.email || "",
        contact_number: userProfile.contact_number || "",
        dob: userProfile.dob ? new Date(userProfile.dob).toISOString().split('T')[0] : "",
        avatar_url: userProfile.avatar_url || ""
      });
      setIsEditing(false);
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: formData.first_name,
          middle_name: formData.middle_name,
          last_name: formData.last_name,
          name_suffix: formData.name_suffix,
          contact_number: formData.contact_number,
          dob: formData.dob || null,
          avatar_url: formData.avatar_url
        })
        .eq('id', user.id);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
      await refreshUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PersonalInfoFields formData={formData} handleChange={handleChange} />
        <ContactInfoFields formData={formData} handleChange={handleChange} />
      </div>
      <Button 
        type="submit" 
        disabled={!isEditing}
        className="bg-[#8b73f4] hover:bg-[#8b73f4]/90 text-white"
      >
        Update Profile
      </Button>
    </form>
  );
};
