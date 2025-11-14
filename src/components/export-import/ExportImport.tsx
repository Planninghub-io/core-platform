import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { Download, Upload, FileText, Calendar, CheckCircle2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ExportOptions {
  format: 'json' | 'csv' | 'pdf';
  includeEvents: boolean;
  includeTemplates: boolean;
  includeExpenses: boolean;
  dateRange: 'all' | '30' | '90' | '365';
}

export const ExportImport = () => {
  const { user } = useAuthRedirect({ skipRedirect: true });
  const { toast } = useToast();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    includeEvents: true,
    includeTemplates: false,
    includeExpenses: false,
    dateRange: 'all',
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const exportData = async () => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'Please log in to export data',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    try {
      const data: any = {
        exportDate: new Date().toISOString(),
        version: '1.0',
      };

      // Calculate date range
      let startDate: Date | null = null;
      if (exportOptions.dateRange !== 'all') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(exportOptions.dateRange));
      }

      // Export events
      if (exportOptions.includeEvents) {
        let eventsQuery = supabase
          .from('events')
          .select('*')
          .eq('user_id', user.id);

        if (startDate) {
          eventsQuery = eventsQuery.gte('created_at', startDate.toISOString());
        }

        const { data: events, error: eventsError } = await eventsQuery.order('created_at', { ascending: false });

        if (eventsError) throw eventsError;
        data.events = events || [];
      }

      // Export templates
      if (exportOptions.includeTemplates) {
        try {
          const { data: templates, error: templatesError } = await (supabase
            .from('event_templates' as any)
            .select('*')
            .eq('user_id', user.id) as any);

          if (!templatesError) {
            data.templates = templates || [];
          }
        } catch (e) {
          console.log('Templates table not available');
        }
      }

      // Export expenses
      if (exportOptions.includeExpenses) {
        try {
          // Get all user events first
          const { data: userEvents } = await supabase
            .from('events')
            .select('id')
            .eq('user_id', user.id);

          if (userEvents && userEvents.length > 0) {
            const eventIds = userEvents.map(e => e.id);
            const { data: expenses, error: expensesError } = await (supabase
              .from('event_expenses' as any)
              .select('*')
              .in('event_id', eventIds) as any);

            if (!expensesError) {
              data.expenses = expenses || [];
            }
          }
        } catch (e) {
          console.log('Expenses table not available');
        }
      }

      // Generate file
      let content: string;
      let filename: string;
      let mimeType: string;

      if (exportOptions.format === 'json') {
        content = JSON.stringify(data, null, 2);
        filename = `event-planning-export-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else if (exportOptions.format === 'csv') {
        // Convert events to CSV
        if (data.events && data.events.length > 0) {
          const headers = Object.keys(data.events[0]).join(',');
          const rows = data.events.map((event: any) =>
            Object.values(event).map((val: any) => `"${String(val || '').replace(/"/g, '""')}"`).join(',')
          );
          content = [headers, ...rows].join('\n');
        } else {
          content = 'No events to export';
        }
        filename = `event-planning-export-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        // PDF would require a library like jsPDF or similar
        toast({
          title: 'Info',
          description: 'PDF export coming soon. Please use JSON or CSV format.',
        });
        setIsExporting(false);
        return;
      }

      // Download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: `Data exported successfully as ${exportOptions.format.toUpperCase()}`,
      });
    } catch (error: any) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to export data',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'Please log in to import data',
        variant: 'destructive',
      });
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.events && !data.templates && !data.expenses) {
        throw new Error('Invalid file format');
      }

      let importedCount = 0;

      // Import events
      if (data.events && Array.isArray(data.events)) {
        const eventsToImport = data.events.map((event: any) => ({
          ...event,
          user_id: user.id,
          id: undefined, // Let database generate new IDs
        }));

        const { error: eventsError } = await supabase
          .from('events')
          .insert(eventsToImport);

        if (eventsError) throw eventsError;
        importedCount += eventsToImport.length;
      }

      // Import templates
      if (data.templates && Array.isArray(data.templates)) {
        const templatesToImport = data.templates.map((template: any) => ({
          ...template,
          user_id: user.id,
          id: undefined,
        }));

        try {
          const { error: templatesError } = await (supabase
            .from('event_templates' as any)
            .insert(templatesToImport) as any);

          if (!templatesError) {
            importedCount += templatesToImport.length;
          }
        } catch (e) {
          console.log('Could not import templates');
        }
      }

      toast({
        title: 'Success',
        description: `Imported ${importedCount} items successfully`,
      });
    } catch (error: any) {
      console.error('Error importing data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to import data. Please check the file format.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Export & Import</h2>
        <p className="text-muted-foreground">Backup and restore your event data</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>Download your events and data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Export Format</label>
              <Select
                value={exportOptions.format}
                onValueChange={(value: 'json' | 'csv' | 'pdf') =>
                  setExportOptions({ ...exportOptions, format: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select
                value={exportOptions.dateRange}
                onValueChange={(value: 'all' | '30' | '90' | '365') =>
                  setExportOptions({ ...exportOptions, dateRange: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                  <SelectItem value="365">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Include</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeEvents}
                    onChange={(e) =>
                      setExportOptions({ ...exportOptions, includeEvents: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Events</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeTemplates}
                    onChange={(e) =>
                      setExportOptions({ ...exportOptions, includeTemplates: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Templates</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeExpenses}
                    onChange={(e) =>
                      setExportOptions({ ...exportOptions, includeExpenses: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Expenses</span>
                </label>
              </div>
            </div>

            <Button
              onClick={exportData}
              disabled={isExporting || (!exportOptions.includeEvents && !exportOptions.includeTemplates && !exportOptions.includeExpenses)}
              className="w-full"
            >
              {isExporting ? 'Exporting...' : 'Export Data'}
            </Button>
          </CardContent>
        </Card>

        {/* Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Data
            </CardTitle>
            <CardDescription>Restore from a backup file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Select a JSON export file to import
              </p>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                disabled={isImporting}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file">
                <span className="inline-block">
                  <Button variant="outline" disabled={isImporting} type="button">
                    {isImporting ? 'Importing...' : 'Choose File'}
                  </Button>
                </span>
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Importing will create new records. Existing data will not be overwritten.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

