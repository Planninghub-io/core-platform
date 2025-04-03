
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default CurrentSubscriptionCard;
