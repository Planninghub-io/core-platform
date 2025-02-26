
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";

const UserProfileSettings = () => {
  const { toast } = useToast();
  const { userProfile, refreshUserProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    name_suffix: "",
    email: "",
    contact_number: "",
    dob: "",
    avatar_url: ""
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

      if (error) throw error;

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

  if (!userProfile) {
    return (
      <div className="p-6 rounded-lg bg-gradient-to-r from-violet-50/80 to-fuchsia-50/80 border border-purple-100">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-lg bg-gradient-to-r from-violet-50/80 to-fuchsia-50/80 border border-purple-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
              <Label htmlFor="email" className="text-[#333333] font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="border-purple-100 bg-purple-50/50 text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_number" className="text-[#333333] font-medium">Phone Number</Label>
              <Input
                id="contact_number"
                name="contact_number"
                type="tel"
                value={formData.contact_number}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
              />
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
            <div className="space-y-2">
              <Label htmlFor="avatar_url" className="text-[#333333] font-medium">Avatar URL</Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                type="url"
                value={formData.avatar_url}
                onChange={handleChange}
                placeholder="Enter your avatar URL"
                className="border-purple-100 focus-visible:ring-[#8b73f4]/20"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={!isEditing}
            className="bg-[#8b73f4] hover:bg-[#8b73f4]/90 text-white"
          >
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileSettings;
