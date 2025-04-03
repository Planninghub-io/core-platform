
import React from 'react';
import { Button } from "@/components/ui/button";
import PricingCard from './PricingCard';
import { billingPlans } from '@/data/billingPlans';

interface PricingPlansProps {
  onSubscribe: (planId: string) => void;
  onViewPricing: () => void;
}

const PricingPlans = ({ onSubscribe, onViewPricing }: PricingPlansProps) => {
  return (
    <div className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-2 text-purple-900">Billing & Subscription</h2>
      <p className="text-gray-600 mb-6">Manage your subscription and payment methods</p>
      
      <div className="grid md:grid-cols-3 gap-6">
        {billingPlans.map((plan) => (
          <PricingCard 
            key={plan.id}
            plan={plan}
            onSubscribe={() => onSubscribe(plan.id)}
          />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-2">
          Looking for more details about our plans?
        </p>
        <Button 
          variant="outline" 
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
          onClick={onViewPricing}
        >
          View Full Pricing Details
        </Button>
      </div>
    </div>
  );
};

export default PricingPlans;
