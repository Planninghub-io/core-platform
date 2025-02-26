
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpenseCategory {
  name: string;
  amount: number;
  color: string;
}

interface EventDashboardProps {
  event: {
    title: string;
    budget?: number;
  };
}

export const EventDashboard = ({ event }: EventDashboardProps) => {
  // Sample data - in a real app, this would come from your backend
  const plannedBudget = event.budget || 10000; // Default budget if none set
  const expenses: ExpenseCategory[] = [
    { name: 'Catering', amount: 3000, color: '#8B5CF6' },
    { name: 'Transportation', amount: 1500, color: '#D946EF' },
    { name: 'Decoration', amount: 2000, color: '#F97316' },
    { name: 'A/V Equipment', amount: 1800, color: '#0EA5E9' },
  ];

  // Calculate remaining budget
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = plannedBudget - totalSpent;
  
  // Add remaining budget to expenses array for visualization
  const allData = [
    ...expenses,
    { name: 'Remaining', amount: remaining > 0 ? remaining : 0, color: '#22C55E' }
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold">${plannedBudget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold text-emerald-600">
                ${remaining.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-grow">
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={allData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 100,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" unit="$" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Amount']}
                contentStyle={{ background: 'white', border: '1px solid #ccc' }}
              />
              <Bar 
                dataKey="amount" 
                fill="#8B5CF6"
                radius={[0, 4, 4, 0]}
              >
                {allData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
