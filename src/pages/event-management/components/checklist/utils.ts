
import React from "react";
import { 
  Building2, 
  Users, 
  Truck, 
  DollarSign, 
  Megaphone, 
  FileText 
} from "lucide-react";

// Category icons mapping
export const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'venue':
      return <Building2 className="h-4 w-4" />;
    case 'vendors':
      return <Users className="h-4 w-4" />;
    case 'guests':
      return <Users className="h-4 w-4" />;
    case 'logistics':
      return <Truck className="h-4 w-4" />;
    case 'budget':
      return <DollarSign className="h-4 w-4" />;
    case 'marketing':
      return <Megaphone className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

// Category color mapping
export const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'venue':
      return "bg-blue-100 text-blue-800";
    case 'vendors':
      return "bg-purple-100 text-purple-800";
    case 'guests':
      return "bg-green-100 text-green-800";
    case 'logistics':
      return "bg-yellow-100 text-yellow-800";
    case 'budget':
      return "bg-emerald-100 text-emerald-800";
    case 'marketing':
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Timeline order for sorting
export const timelineOrder = [
  "Immediately",
  "1 month before",
  "2 weeks before",
  "1 week before",
  "Day before",
  "Day of event",
  "Post-event"
];

export const categoryFilters = [
  { value: "venue", label: "Venue" },
  { value: "vendors", label: "Vendors" },
  { value: "guests", label: "Guests" },
  { value: "logistics", label: "Logistics" },
  { value: "budget", label: "Budget" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Other" }
];
