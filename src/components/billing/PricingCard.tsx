
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { formatCurrency } from '@/utils/priceUtils';
import { BillingPlan } from '@/data/billingPlans';

interface PricingCardProps {
  plan: BillingPlan;
  onSubscribe: () => void;
}

const PricingCard = ({ plan, onSubscribe }: PricingCardProps) => {
  return (
    <Card className={`flex flex-col h-full relative ${plan.popular ? 'border-purple-400 shadow-md' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-24 text-center text-xs font-medium bg-purple-500 text-white py-1 rounded-full">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-2">
          <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
          {plan.price > 0 && <span className="text-gray-500 ml-1">/{plan.interval}</span>}
          {plan.price === 0 && <span className="text-gray-500 ml-1">Free</span>}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onSubscribe} 
          className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
          variant={plan.popular ? 'default' : 'outline'}
        >
          {plan.cta}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
