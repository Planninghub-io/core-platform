
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const subscriptionPlans = [
  {
    id: "base",
    name: "Base",
    price: "$0",
    description: "Basic features for personal use",
    features: ["Basic event creation", "Limited to 5 events", "Community support"]
  },
  {
    id: "planner",
    name: "Planner",
    price: "$29",
    description: "Perfect for event planners",
    features: ["Unlimited events", "Priority support", "Custom branding"]
  },
  {
    id: "pro",
    name: "Pro",
    price: "$79",
    description: "Advanced features for professionals",
    features: ["Advanced analytics", "Team collaboration", "API access"]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    description: "Custom solutions for large organizations",
    features: ["Custom features", "Dedicated support", "SLA guarantee"]
  }
];

const BillingSettings = () => {
  const [selectedPlan, setSelectedPlan] = useState("base");

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-violet-50/80 to-fuchsia-50/80 border-purple-100">
        <CardHeader>
          <CardTitle className="text-purple-900">Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            defaultValue={selectedPlan}
            onValueChange={setSelectedPlan}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {subscriptionPlans.map((plan) => (
              <Label
                key={plan.id}
                className={`flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? "border-purple-500 bg-white shadow-md"
                    : "border-transparent bg-white/50 hover:bg-white hover:shadow-sm"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={plan.id} id={plan.id} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-purple-900">
                        {plan.name}
                      </span>
                      <span className="font-bold text-purple-700">{plan.price}</span>
                    </div>
                    <p className="text-sm text-purple-600 mt-1">
                      {plan.description}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-sm text-purple-700 flex items-center gap-2"
                        >
                          <span className="h-1 w-1 rounded-full bg-purple-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>
          <div className="mt-6">
            <Button 
              className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white"
            >
              Update Subscription
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingSettings;
