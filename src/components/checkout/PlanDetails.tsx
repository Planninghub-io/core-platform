
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { formatCurrency } from '@/utils/priceUtils';

interface PlanDetailsProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    interval: string;
  };
  loading: boolean;
  directCheckout: boolean;
  onCancel: () => void;
  onProcessPayment: () => void;
}

const PlanDetails = ({ 
  plan, 
  loading, 
  directCheckout, 
  onCancel, 
  onProcessPayment 
}: PlanDetailsProps) => {
  return (
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
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          className="flex-1 bg-purple-600 hover:bg-purple-700"
          onClick={onProcessPayment}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {plan.price > 0 ? (directCheckout ? 'Try Alternative Payment' : 'Proceed to Payment') : 'Activate Free Plan'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanDetails;
