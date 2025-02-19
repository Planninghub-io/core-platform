
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import BusinessDetailsForm from "./BusinessDetailsForm";

interface AuthFormProps {
  type?: 'business' | 'user';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const isBusiness = type === 'business';

  const handleSignUp = async (formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    businessEmail?: string;
    businessPhone?: string;
  }) => {
    const { email, password, firstName, lastName, companyName, businessEmail, businessPhone } = formData;

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (isSignUp && isBusiness && (!companyName || !businessEmail || !businessPhone)) {
      toast({
        title: "Error",
        description: "Please fill in all business details",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
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
        return;
      }

      if (isBusiness && authData.user) {
        // Create company
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .insert([{
            name: companyName,
            type: 'vendor',
            business_email: businessEmail,
            business_phone: businessPhone
          }])
          .select()
          .single();

        if (companyError) throw companyError;

        if (companyData) {
          // Create company membership for the owner
          const { error: membershipError } = await supabase
            .from('company_members')
            .insert([{
              user_id: authData.user.id,
              company_id: companyData.id,
              role: 'owner',
              status: 'active'
            }]);

          if (membershipError) throw membershipError;
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
    } catch (error: any) {
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (formData: { email: string; password: string; }) => {
    const { email, password } = formData;
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Sign In Failed",
            description: "Incorrect email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign In Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }
    } catch (error: any) {
      toast({
        title: "Sign In Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-2xl font-bold">
        {isSignUp ? `Sign Up${isBusiness ? ' as Business' : ''}` : 'Sign In'}
      </h1>
      {isSignUp ? (
        <SignUpForm
          onSubmit={handleSignUp}
          isLoading={isLoading}
          isBusiness={isBusiness}
        />
      ) : (
        <SignInForm
          onSubmit={handleSignIn}
          isLoading={isLoading}
        />
      )}
      <Button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        variant="outline"
        className="w-full mt-4"
      >
        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </Button>
    </div>
  );
};

export default AuthForm;
