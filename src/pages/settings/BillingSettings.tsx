
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
          <CardTitle className="text-[#333333]">Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            defaultValue={selectedPlan}
            onValueChange={setSelectedPlan}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {subscriptionPlans.map((plan) => (
              <Label
                key={plan.id}
                className={`flex flex-col justify-between p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 h-full ${
                  selectedPlan === plan.id
                    ? "border-[#8b73f4] bg-white shadow-md"
                    : "border-transparent bg-white/50 hover:bg-white hover:shadow-sm"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={plan.id} id={plan.id} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[#333333]">
                        {plan.name}
                      </span>
                      <span className="font-bold text-[#8b73f4]">{plan.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {plan.description}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600 flex items-center gap-2"
                        >
                          <span className="h-1 w-1 rounded-full bg-[#8b73f4]" />
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
              className="w-full md:w-auto bg-[#8b73f4] hover:bg-[#8b73f4]/90 text-white"
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
