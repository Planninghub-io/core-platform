
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PricingPlans from '@/components/billing/PricingPlans';
import CurrentSubscriptionCard from '@/components/billing/CurrentSubscriptionCard';
import PaymentMethodsCard from '@/components/billing/PaymentMethodsCard';

const BillingSettings = () => {
  const navigate = useNavigate();

  const handleSubscribe = (planId: string) => {
    if (planId === "enterprise") {
      window.open("mailto:sales@eventplatform.com", "_blank");
      return;
    }
    
    navigate(`/checkout?plan=${planId}`);
  };

  const handleNavigateToPricing = () => {
    navigate('/pricing');
  };

  return (
    <div className="space-y-6">
      <PricingPlans 
        onSubscribe={handleSubscribe}
        onViewPricing={handleNavigateToPricing}
      />
      
      <CurrentSubscriptionCard />
      <PaymentMethodsCard />
    </div>
  );
};

export default BillingSettings;
