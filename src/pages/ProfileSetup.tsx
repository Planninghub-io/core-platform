
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, User, Phone, Building, Home } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  dob: z.string().optional(),
  account_type: z.enum(["individual", "company"]),
  company_name: z.string().optional(),
  address: z.string().optional(),
  contact_number: z.string().optional(),
  contact_type: z.enum(["business", "mobile"]).default("mobile"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileSetup = () => {
  const { user, loading } = useAuthRedirect({ skipRedirect: true });
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

  const accountType = form.watch("account_type");

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

    if (!loading && user) {
      checkUserProfile();
    } else if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .insert([{
            name: data.company_name,
            type: 'vendor',
            business_phone: data.contact_type === "business" ? data.contact_number : null,
            business_email: user.email,
          }])
          .select()
          .single();

        if (companyError) {
          console.error("Company creation error:", companyError);
          throw companyError;
        }

        // Create user role for the company
        if (companyData) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert([{
              user_id: user.id,
              company_id: companyData.id,
              role: 'admin'
            }]);

          if (roleError) {
            console.error("Role creation error:", roleError);
            throw roleError;
          }
        }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-lg">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h1>
          <p className="text-gray-600 mb-6 text-center">Please provide some additional information to complete your profile setup.</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="first_name"
                        {...form.register("first_name")}
                        placeholder="Enter your first name"
                        className="pl-9"
                      />
                    </div>
                    {form.formState.errors.first_name && (
                      <p className="text-sm text-red-500">{form.formState.errors.first_name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="last_name"
                        {...form.register("last_name")}
                        placeholder="Enter your last name"
                        className="pl-9"
                      />
                    </div>
                    {form.formState.errors.last_name && (
                      <p className="text-sm text-red-500">{form.formState.errors.last_name.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="dob"
                      type="date"
                      {...form.register("dob")}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <RadioGroup 
                    value={accountType} 
                    onValueChange={(value) => form.setValue("account_type", value as "individual" | "company")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual">Individual</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company">Company</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {accountType === "company" && (
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="company_name"
                        {...form.register("company_name")}
                        placeholder="Enter your company name"
                        className="pl-9"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      {...form.register("address")}
                      placeholder="Enter your address"
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact_number">Contact Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="contact_number"
                      {...form.register("contact_number")}
                      placeholder="Enter your contact number"
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Contact Type</Label>
                  <RadioGroup 
                    value={form.watch("contact_type")} 
                    onValueChange={(value) => form.setValue("contact_type", value as "business" | "mobile")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mobile" id="mobile" />
                      <Label htmlFor="mobile">Mobile</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" id="business" />
                      <Label htmlFor="business">Business Phone</Label>
                    </div>
                  </RadioGroup>
                </div>
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
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
