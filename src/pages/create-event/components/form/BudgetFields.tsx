
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BudgetFieldsProps {
  budget: string;
  budgetCurrency: string;
  attendees: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (field: string, value: any) => void;
}

// Currency options
const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "AUD", label: "AUD ($)" },
  { value: "JPY", label: "JPY (¥)" },
  { value: "INR", label: "INR (₹)" }
];

export const BudgetFields = ({
  budget,
  budgetCurrency,
  attendees,
  handleChange,
  handleSelectChange
}: BudgetFieldsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="budget">Total Budget *</Label>
        <div className="flex space-x-2">
          <Select
            value={budgetCurrency}
            onValueChange={(value) => handleSelectChange('budgetCurrency', value)}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="budget"
            name="budget"
            type="number"
            step="0.01"
            min="0"
            value={budget}
            onChange={handleChange}
            placeholder="0.00"
            required
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="attendees"># of Attendees</Label>
        <Input
          id="attendees"
          name="attendees"
          type="number"
          min="1"
          step="1"
          value={attendees}
          onChange={handleChange}
          placeholder="Number of expected guests"
        />
      </div>
    </div>
  );
};
