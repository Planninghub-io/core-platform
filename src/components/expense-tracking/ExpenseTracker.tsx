import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Edit2, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Expense {
  id: string;
  event_id: string;
  category: string;
  description: string | null;
  amount: number;
  vendor: string | null;
  date: string;
  status: 'pending' | 'approved' | 'paid';
  receipt_url: string | null;
  created_at: string;
}

interface ExpenseCategory {
  name: string;
  total: number;
  color: string;
}

const EXPENSE_CATEGORIES = [
  'Catering',
  'Venue',
  'Transportation',
  'Decoration',
  'A/V Equipment',
  'Marketing',
  'Staff',
  'Entertainment',
  'Other',
];

const CATEGORY_COLORS: Record<string, string> = {
  'Catering': '#C4B5FD',
  'Venue': '#EC4899',
  'Transportation': '#F59E0B',
  'Decoration': '#10B981',
  'A/V Equipment': '#3B82F6',
  'Marketing': '#EF4444',
  'Staff': '#8B5CF6',
  'Entertainment': '#06B6D4',
  'Other': '#6B7280',
};

export const ExpenseTracker = ({ eventId, eventBudget }: { eventId: string; eventBudget?: number | null }) => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    vendor: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending' as 'pending' | 'approved' | 'paid',
  });

  useEffect(() => {
    fetchExpenses();
  }, [eventId]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase
        .from('event_expenses' as any)
        .select('*')
        .eq('event_id', eventId)
        .order('date', { ascending: false }) as any);

      if (error) {
        // Table might not exist, create mock data for demo
        console.log('Expenses table not found, using mock data');
        setExpenses([]);
      } else {
        setExpenses((data || []) as Expense[]);
      }
    } catch (error: any) {
      console.error('Error fetching expenses:', error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const saveExpense = async () => {
    try {
      const expenseData = {
        event_id: eventId,
        category: formData.category,
        description: formData.description || null,
        amount: parseFloat(formData.amount),
        vendor: formData.vendor || null,
        date: formData.date,
        status: formData.status,
      };

      if (editingExpense) {
        const { error } = await (supabase
          .from('event_expenses' as any)
          .update(expenseData)
          .eq('id', editingExpense.id) as any);

        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Expense updated successfully!',
        });
      } else {
        const { error } = await (supabase
          .from('event_expenses' as any)
          .insert([expenseData] as any) as any);

        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Expense added successfully!',
        });
      }

      setFormData({
        category: '',
        description: '',
        amount: '',
        vendor: '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
      });
      setEditingExpense(null);
      setIsDialogOpen(false);
      fetchExpenses();
    } catch (error: any) {
      console.error('Error saving expense:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save expense. The expenses table may need to be created.',
        variant: 'destructive',
      });
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await (supabase
        .from('event_expenses' as any)
        .delete()
        .eq('id', id) as any);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Expense deleted successfully!',
      });

      fetchExpenses();
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete expense',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      category: expense.category,
      description: expense.description || '',
      amount: expense.amount.toString(),
      vendor: expense.vendor || '',
      date: expense.date.split('T')[0],
      status: expense.status,
    });
    setIsDialogOpen(true);
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budget = eventBudget || 0;
  const remaining = budget - totalSpent;
  const budgetPercentage = budget > 0 ? (totalSpent / budget) * 100 : 0;

  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category;
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryData: ExpenseCategory[] = Object.entries(categoryTotals).map(([name, total]) => ({
    name,
    total,
    color: CATEGORY_COLORS[name] || '#6B7280',
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      {budget > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Track your spending against budget</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">${budget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className="text-2xl font-bold text-purple-600">${totalSpent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${remaining.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Budget Usage</span>
                <span>{budgetPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={Math.min(budgetPercentage, 100)} className={budgetPercentage > 100 ? 'bg-red-500' : ''} />
              {budgetPercentage > 100 && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Budget exceeded
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="font-semibold">${category.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Expenses</CardTitle>
              <CardDescription>Track all event expenses</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingExpense(null);
                setFormData({
                  category: '',
                  description: '',
                  amount: '',
                  vendor: '',
                  date: new Date().toISOString().split('T')[0],
                  status: 'pending',
                });
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
                  <DialogDescription>
                    {editingExpense ? 'Update expense details' : 'Record a new expense for this event'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Expense description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vendor">Vendor</Label>
                    <Input
                      id="vendor"
                      value={formData.vendor}
                      onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                      placeholder="Vendor name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={saveExpense} disabled={!formData.category || !formData.amount}>
                      {editingExpense ? 'Update' : 'Add'} Expense
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No expenses recorded yet</p>
                <p className="text-sm">Add your first expense to start tracking</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" style={{ borderColor: CATEGORY_COLORS[expense.category] || '#6B7280' }}>
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{expense.description || '-'}</TableCell>
                      <TableCell>{expense.vendor || '-'}</TableCell>
                      <TableCell className="font-semibold">${expense.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            expense.status === 'paid' ? 'default' :
                            expense.status === 'approved' ? 'secondary' : 'outline'
                          }
                        >
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(expense)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteExpense(expense.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
    </div>
  );
};

