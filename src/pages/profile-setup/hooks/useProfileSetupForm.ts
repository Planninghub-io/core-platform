
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { profileSchema, ProfileFormValues } from "../schema";
import { User } from "@supabase/supabase-js";

export const useProfileSetupForm = (user: User | null) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      dob: "",
      account_type: "individual",
      company_name: "",
      address: "",
      contact_number: "",
      contact_type: "mobile",
    }
  });

  useEffect(() => {
    // Check if the user already has a profile
    const checkUserProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        if (!error && data && data.first_name && data.last_name) {
          // User already has a profile set up
          const { error: updateError } = await supabase.auth.updateUser({
            data: { needs_profile_setup: false }
          });
          
          if (!updateError) {
            navigate('/');
          }
        }
      }
    };

    if (user) {
      checkUserProfile();
    }
  }, [user, navigate]);

  const onSubmit = async (data: ProfileFormValues) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Update user_profiles table with correct user_type value
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          dob: data.dob || null,
          user_type: data.account_type, // This now matches the constraint in the database
          contact_number: data.contact_number,
          address: data.address,
        })
        .eq('id', user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        throw profileError;
      }

      // If company, create a company record
      if (data.account_type === "company" && data.company_name) {
        // Use service role function to handle company creation and role assignment
        // This avoids RLS issues with the user_roles table
        const { data: functionData, error: functionError } = await supabase.functions.invoke(
          'setup-company-profile',
          {
            body: {
              companyName: data.company_name,
              businessPhone: data.contact_type === "business" ? data.contact_number : null,
              businessEmail: user.email
            }
          }
        );

        if (functionError) {
          console.error("Company setup error:", functionError);
          throw functionError;
        }

        console.log("Company setup successful:", functionData);
      }

      // Update user metadata to mark profile as set up
      const { error: updateError } = await supabase.auth.updateUser({
        data: { needs_profile_setup: false }
      });

      if (updateError) {
        console.error("User metadata update error:", updateError);
        throw updateError;
      }

      toast.success("Profile set up successfully", {
        description: "Your profile has been created successfully.",
      });

      // Redirect to home page
      navigate('/');
    } catch (error: any) {
      console.error('Error setting up profile:', error);
      toast.error("Error", {
        description: error.message || "Failed to set up profile",
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
