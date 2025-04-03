import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { formatCurrency } from '@/utils/priceUtils';

const BillingSettings = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: "basic",
      name: "Basic",
      description: "Essential features for small events",
      price: 0,
      interval: "month",
      features: [
        "Up to 5 events",
        "Basic event management",
        "Email invitations",
        "Standard support"
      ],
      popular: false,
      cta: "Get Started"
    },
    {
      id: "professional",
      name: "Professional",
      description: "Everything needed for growing events",
      price: 29,
      interval: "month",
      features: [
        "Up to 20 events",
        "Advanced event management",
        "Custom email invitations",
        "Premium support",
        "Analytics dashboard",
        "Team collaboration"
      ],
      popular: true,
      cta: "Upgrade Now"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large-scale event management",
      price: 99,
      interval: "month",
      features: [
        "Unlimited events",
        "Full event management suite",
        "Custom branding",
        "Priority support",
        "Advanced analytics",
        "Dedicated account manager",
        "API access"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  const handleSubscribe = (planId: string) => {
    if (planId === "enterprise") {
      window.open("mailto:sales@eventplatform.com", "_blank");
      return;
    }
    
    navigate(`/pricing?plan=${planId}`);
  };

  const handleNavigateToPricing = () => {
    navigate('/pricing');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-purple-900">Billing & Subscription</h2>
        <p className="text-gray-600 mb-6">Manage your subscription and payment methods</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PricingCard 
              key={plan.id}
              plan={plan}
              onSubscribe={() => handleSubscribe(plan.id)}
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
            onClick={handleNavigateToPricing}
          >
            View Full Pricing Details
          </Button>
        </div>
      </div>
      
      <CurrentSubscriptionCard />
      <PaymentMethodsCard />
      
    </div>
  );
};

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    interval: string;
    features: string[];
    popular: boolean;
    cta: string;
  };
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

const CurrentSubscriptionCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Current Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Plan</span>
            <span className="text-purple-600 font-semibold">Basic</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Billing Cycle</span>
            <span>Monthly</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Next Billing Date</span>
            <span>N/A</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PaymentMethodsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">No payment methods added yet.</p>
        <Button variant="outline" className="mt-4">
          Add Payment Method
        </Button>
      </CardContent>
    </Card>
  );
};

export default BillingSettings;
