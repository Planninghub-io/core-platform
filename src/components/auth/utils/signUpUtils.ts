
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";

type CompanyType = Database["public"]["Enums"]["company_type"];

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  businessPhone?: string;
}

export const handleUserSignUp = async (
  formData: SignUpData,
  isBusiness: boolean,
  toast: any,
  redirectCallback: () => void
) => {
  const { email, password, firstName, lastName, companyName, businessPhone } = formData;

  if (password.length < 6) {
    toast({
      title: "Error",
      description: "Password must be at least 6 characters long",
      variant: "destructive",
    });
    return false;
  }

  if (isBusiness && (!companyName || !businessPhone)) {
    toast({
      title: "Error",
      description: "Please fill in all business details",
      variant: "destructive",
    });
    return false;
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: window.location.origin
      }
    });

    if (authError) {
      if (authError.message === "User already registered") {
        toast({
          title: "Account Exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
      } else {
        throw authError;
      }
      return false;
    }

    if (isBusiness && authData.user) {
      // Create company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([{
          name: companyName,
          type: 'vendor' as CompanyType,
          business_email: email, // Use the same email
          business_phone: businessPhone
        }])
        .select()
        .single();

      if (companyError) throw companyError;

      if (companyData) {
        // Create user role for the company
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: authData.user.id,
            company_id: companyData.id,
            role: 'admin'
          }]);

        if (roleError) throw roleError;
      }

      // Update user profile type
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ user_type: 'business' })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;
    }

    toast({
      title: "Success!",
      description: "Check your email to confirm your account.",
    });
    
    redirectCallback();
    return true;
  } catch (error: any) {
    toast({
      title: "Sign Up Error",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};
