
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

  const connectStripeAccount = () => {
    // Redirect to Supabase Edge Function that will handle Stripe Connect OAuth
    window.open('/api/stripe-connect', '_blank');
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
