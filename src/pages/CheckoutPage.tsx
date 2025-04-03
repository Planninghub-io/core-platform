
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from '@/utils/priceUtils';

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);

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
      
      // Call Stripe Connect edge function to create checkout session
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { planId: plan.id }
      });
      
      if (error) {
        throw new Error(`Error initiating checkout: ${error.message}`);
      }
      
      // Redirect to Stripe checkout URL
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Failed to process payment", { 
        description: error instanceof Error ? error.message : "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/settings/billing');
  };

  if (!plan) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">Complete Your Subscription</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{plan.name} Plan</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Subscription Plan</span>
                <span>{plan.name}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Billing Interval</span>
                <span>Monthly</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Price</span>
                <span className="font-semibold text-lg text-purple-700">
                  {formatCurrency(plan.price)}/{plan.interval}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={handleProcessPayment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {plan.price > 0 ? 'Proceed to Payment' : 'Activate Free Plan'}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <p className="text-sm text-center text-gray-500 mt-4">
          Your subscription will begin immediately after payment processing.
          {plan.price > 0 && " You'll be redirected to our secure payment provider to complete your purchase."}
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;
