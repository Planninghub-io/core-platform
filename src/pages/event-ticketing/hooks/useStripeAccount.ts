
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { APP_URL } from "@/integrations/supabase/client";

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
      // Get the current origin for URL construction
      const origin = window.location.origin;
      
      // Get the current path to redirect back after Stripe connect
      const currentPath = window.location.pathname;
      
      // Store the current path in localStorage for redirect after Stripe connect
      localStorage.setItem('stripeConnectReturnPath', currentPath);
      
      // Call the Stripe Connect edge function directly, not in a new tab
      window.location.href = `${origin}/api/stripe-connect`;
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
