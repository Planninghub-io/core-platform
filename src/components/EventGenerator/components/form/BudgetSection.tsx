
import React, { useState } from "react";
import { BudgetInput } from "./budget/BudgetInput";
import { AttendeesInput } from "./attendees/AttendeesInput";

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
        <BudgetInput budget={budget} setBudget={setBudget} />
        <AttendeesInput attendees={attendees} setAttendees={setAttendees} />
      </div>
    </div>
  );
};
