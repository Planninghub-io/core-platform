
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, DollarSign } from "lucide-react";

interface ExpenseCategory {
  name: string;
  amount: number;
  color: string;
}

interface VendorQuote {
  vendorName: string;
  service: string;
  amount: number;
  message: string;
}

interface EventDashboardProps {
  event: {
    title: string;
    budget?: number;
  };
}

export const EventDashboard = ({ event }: EventDashboardProps) => {
  // Sample data - in a real app, this would come from your backend
  const plannedBudget = event.budget || 10000;
  const expenses: ExpenseCategory[] = [
    { name: 'Catering', amount: 3000, color: '#8B5CF6' },
    { name: 'Transportation', amount: 1500, color: '#D946EF' },
    { name: 'Decoration', amount: 2000, color: '#F97316' },
    { name: 'A/V Equipment', amount: 1800, color: '#0EA5E9' },
  ];

  // Sample vendor quotes - in a real app, this would come from your backend
  const vendorQuotes: VendorQuote[] = [
    {
      vendorName: "Elite Catering Co.",
      service: "Catering",
      amount: 3000,
      message: "Full-service catering including setup, service, and cleanup. Menu includes appetizers, main course, and desserts."
    },
    {
      vendorName: "Premier Transport",
      service: "Transportation",
      amount: 1500,
      message: "Luxury shuttle service for all guests, including dedicated event coordinator."
    },
    {
      vendorName: "Creative Decor",
      service: "Decoration",
      amount: 2000,
      message: "Complete venue decoration including floral arrangements, lighting, and table settings."
    },
    {
      vendorName: "Sound & Vision Pro",
      service: "A/V Equipment",
      amount: 1800,
      message: "Professional audio/visual setup including speakers, microphones, and projection system."
    }
  ];

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = plannedBudget - totalSpent;
  
  const allData = [
    ...expenses,
    { name: 'Remaining', amount: remaining > 0 ? remaining : 0, color: '#22C55E' }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
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

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
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

      <Card>
        <CardHeader>
          <CardTitle>Vendor Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {vendorQuotes.map((quote, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{quote.vendorName}</h3>
                      <p className="text-sm text-muted-foreground">{quote.service}</p>
                    </div>
                    <div className="flex items-center text-lg font-semibold">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {quote.amount.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                    <p className="text-sm">{quote.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
