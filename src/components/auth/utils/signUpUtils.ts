
import { supabase, APP_URL } from "@/integrations/supabase/client";
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
  role?: string;
  acceptedTerms: boolean;
}

export const handleUserSignUp = async (
  formData: SignUpData,
  isBusiness: boolean,
  toast: any,
  redirectCallback: () => void
) => {
  const { email, password, firstName, lastName, companyName, businessPhone, role, acceptedTerms } = formData;

  if (!acceptedTerms) {
    toast({
      title: "Terms Required",
      description: "You must accept the Terms of Service to continue",
      variant: "destructive",
    });
    return false;
  }

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
          accepted_terms: acceptedTerms,
          role: role || (isBusiness ? 'business_admin' : 'user'),
          is_business: isBusiness,
        },
        emailRedirectTo: `${APP_URL}/auth/email-verification`
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
      title: "Account Created!",
      description: "Please check your email to verify your account.",
    });
    
    // Send welcome email
    try {
      await supabase.functions.invoke('welcome-email', {
        body: { email, firstName, lastName, isBusiness }
      });
    } catch (emailError) {
      console.error("Welcome email could not be sent:", emailError);
      // We don't want to fail the signup if just the welcome email fails
    }
    
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
