
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStripeAccount = () => {
  const [hasStripeAccount, setHasStripeAccount] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkStripeAccount = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setHasStripeAccount(false);
        return;
      }

      // Check if user has a Stripe Connect account set up
      const { data, error } = await supabase
        .from('user_profiles')
        .select('stripe_account_id')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      
      setHasStripeAccount(!!data?.stripe_account_id);
    } catch (error) {
      console.error("Error checking Stripe account:", error);
      toast({
        title: "Error",
        description: "Failed to verify payment account status.",
        variant: "destructive",
      });
      setHasStripeAccount(false);
    } finally {
      setLoading(false);
    }
  };

  const connectStripeAccount = async () => {
    try {
      // Get the current path to redirect back after Stripe connect
      const currentPath = window.location.pathname;
      
      // Store the current path in localStorage for redirect after Stripe connect
      localStorage.setItem('stripeConnectReturnPath', currentPath);
      
      console.log("Initiating Stripe Connect process");
      
      // Call the Stripe Connect edge function using Supabase invoke
      const { data, error } = await supabase.functions.invoke('stripe-connect');
      
      if (error) {
        throw new Error(`Error invoking Stripe Connect function: ${error.message}`);
      }
      
      // Safely check if data and data.url exist before redirecting
      if (data && typeof data === 'object' && 'url' in data && data.url) {
        console.log("Redirecting to Stripe Connect URL:", data.url);
        window.location.href = data.url;
      } else {
        console.error("Invalid response from Stripe Connect function:", data);
        throw new Error("No valid redirect URL returned from Stripe Connect function");
      }
    } catch (error) {
      console.error("Error initiating Stripe connect:", error);
      toast({
        title: "Connection Error",
        description: "Failed to start payment account connection. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkStripeAccount();
  }, []);

  return {
    hasStripeAccount,
    loading,
    checkStripeAccount,
    connectStripeAccount
  };
};
