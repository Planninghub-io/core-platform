
import React from 'react';
import { Loader2 } from "lucide-react";
import PlanDetails from '@/components/checkout/PlanDetails';
import CheckoutNotice from '@/components/checkout/CheckoutNotice';
import { useCheckoutPlan } from '@/hooks/useCheckoutPlan';

const CheckoutPage = () => {
  const {
    plan,
    loading,
    directCheckout,
    handleProcessPayment,
    handleCancel
  } = useCheckoutPlan();

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
        
        <PlanDetails
          plan={plan}
          loading={loading}
          directCheckout={directCheckout}
          onCancel={handleCancel}
          onProcessPayment={handleProcessPayment}
        />
        
        <CheckoutNotice 
          isPaid={plan.price > 0}
          directCheckout={directCheckout}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
