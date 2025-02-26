import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, DollarSign, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

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
  const [selectedQuote, setSelectedQuote] = useState<VendorQuote | null>(null);
  
  const plannedBudget = event.budget || 10000;
  const expenses: ExpenseCategory[] = [
    { name: 'Catering', amount: 3000, color: '#C4B5FD' },
    { name: 'Transportation', amount: 1500, color: '#FDA4AF' },
    { name: 'Decoration', amount: 2000, color: '#FDBA74' },
    { name: 'A/V Equipment', amount: 1800, color: '#93C5FD' },
  ];

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
    { name: 'Remaining', amount: remaining > 0 ? remaining : 0, color: '#BBF7D0' }
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview & Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
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

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={allData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 30,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis unit="$" stroke="#6B7280" />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Amount']}
                  contentStyle={{ background: 'white', border: '1px solid #E5E7EB' }}
                />
                <Bar 
                  dataKey="amount" 
                  radius={[4, 4, 0, 0]}
                >
                  {allData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="#E5E7EB" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {vendorQuotes.map((quote, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border transition-colors hover:bg-accent cursor-pointer"
                style={{
                  borderLeft: `4px solid ${expenses[index].color}`,
                }}
                onClick={() => setSelectedQuote(quote)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold">{quote.vendorName}</h3>
                      <p className="text-sm text-muted-foreground">{quote.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center font-semibold">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {quote.amount.toLocaleString()}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedQuote?.vendorName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Service</p>
              <p className="font-medium">{selectedQuote?.service}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium">${selectedQuote?.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Details</p>
              <p className="font-medium">{selectedQuote?.message}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
