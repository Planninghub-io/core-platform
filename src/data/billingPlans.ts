
export const billingPlans = [
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

export type BillingPlan = typeof billingPlans[0];
