
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DollarSign, Users } from "lucide-react";

interface BudgetSectionProps {
  budget: string;
  setBudget: (budget: string) => void;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({
  budget,
  setBudget
}) => {
  const [attendees, setAttendees] = useState<string>("10");

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <Label htmlFor="budget">Estimated Budget</Label>
          </div>
          <Input
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter estimated budget"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-gray-500" />
            <Label htmlFor="attendees">Attendees</Label>
          </div>
          <Input
            id="attendees"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            placeholder="Number of attendees"
            type="number"
            min="1"
          />
        </div>
      </div>
    </div>
  );
};
