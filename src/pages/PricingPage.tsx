
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PricingPage = () => {
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get('plan');
  
  useEffect(() => {
    if (selectedPlan) {
      // Auto-scroll to the pricing section
      document.getElementById(selectedPlan)?.scrollIntoView({ behavior: 'smooth' });
      
      // Show a toast notification about the selected plan
      toast.info(`You selected the ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan`, {
        description: "Complete your payment to activate this subscription"
      });
    }
  }, [selectedPlan]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Pricing Plans</h1>
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div id="basic" className="p-6 rounded-lg bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Basic</h2>
          <p className="text-gray-600 mb-4">For small events</p>
          <div className="mt-6">
            <Button className="w-full">Get Started</Button>
          </div>
        </div>
        <div id="professional" className="p-6 rounded-lg bg-white shadow-md border-2 border-purple-400">
          <h2 className="text-xl font-semibold mb-4">Professional</h2>
          <p className="text-gray-600 mb-4">For medium sized events</p>
          <div className="mt-6">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Subscribe Now</Button>
          </div>
        </div>
        <div id="enterprise" className="p-6 rounded-lg bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Enterprise</h2>
          <p className="text-gray-600 mb-4">For large-scale events</p>
          <div className="mt-6">
            <Button className="w-full" variant="outline">Contact Sales</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
