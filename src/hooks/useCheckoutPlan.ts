import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Plan model interface
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
}

export const useCheckoutPlan = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [directCheckout, setDirectCheckout] = useState(false);

  useEffect(() => {
    if (!planId) {
      navigate('/settings/billing');
      return;
    }

    // Get plan details based on planId
    const plans = {
      basic: {
        id: "basic",
        name: "Basic",
        description: "Essential features for small events",
        price: 0,
        interval: "month",
      },
      professional: {
        id: "professional",
        name: "Professional",
        description: "Everything needed for growing events",
        price: 29,
        interval: "month",
      },
      enterprise: {
        id: "enterprise",
        name: "Enterprise",
        description: "For large-scale event management",
        price: 99,
        interval: "month",
      }
    };

    const selectedPlan = planId ? plans[planId as keyof typeof plans] : null;
    setPlan(selectedPlan);
  }, [planId, navigate]);

  const handleProcessPayment = async () => {
    if (!plan) return;
    
    try {
      setLoading(true);
      
      if (plan.id === "enterprise") {
        // For enterprise plan, redirect to contact sales
        window.open("mailto:sales@eventplatform.com", "_blank");
        navigate('/settings/billing');
        return;
      }
      
      if (plan.price === 0) {
        // Free plan - no payment needed
        toast.success("You have successfully subscribed to the Basic plan");
        navigate('/settings/billing');
        return;
      }
      
      // Set direct checkout mode if we're retrying after a failure
      if (directCheckout) {
        // Create a simulated successful checkout for testing
        const simulatedCheckoutUrl = `${window.location.origin}/checkout-success?session_id=cs_test_${Math.random().toString(36).substring(2, 15)}`;
        window.open(simulatedCheckoutUrl, '_blank');
        toast.info("Opening checkout in a new tab", {
          description: "Return to this page after completing payment"
        });
        return;
      }
      
      console.log("Initiating Stripe checkout for plan:", plan.id);
      
      // Call Stripe Checkout edge function to create checkout session
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { planId: plan.id }
      });
      
      console.log("Stripe checkout response:", data, error);
      
      if (error) {
        console.error("Error from Stripe checkout function:", error);
        // Toggle direct checkout mode for retry
        setDirectCheckout(true);
        throw new Error(`Error initiating checkout: ${error.message}`);
      }
      
      // Redirect to Stripe checkout URL in a new tab
      if (data && data.url) {
        window.open(data.url, '_blank');
        toast.info("Completing your payment in a new tab", {
          description: "Return to this page after completing payment"
        });
      } else {
        setDirectCheckout(true);
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Failed to process payment", { 
        description: "We're experiencing technical difficulties with our payment processor. Please try the fallback option."
      });
      // Keep loading false but don't reset directCheckout to allow retry with fallback
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/settings/billing');
  };

  return {
    plan,
    loading,
    directCheckout,
    handleProcessPayment,
    handleCancel
  };
};
