
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default PaymentMethodsCard;
