
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

interface BudgetSectionProps {
  budget: string;
  setBudget: (budget: string) => void;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({
  budget,
  setBudget
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-gray-500" />
        <Label htmlFor="budget">Budget</Label>
      </div>
      <Input
        id="budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder="Enter your budget"
      />
    </div>
  );
};
