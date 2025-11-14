import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useNavigate } from 'react-router-dom';
import { Plus, Copy, Trash2, FileText, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface EventTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  event_type: string | null;
  location: string | null;
  budget: number | null;
  expected_attendees: number | null;
  description_template: string | null;
  created_at: string;
}

export const EventTemplates = () => {
  const { user } = useAuthRedirect({ skipRedirect: true });
  const { toast } = useToast();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<EventTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    event_type: '',
    location: '',
    budget: '',
    expected_attendees: '',
    description_template: '',
  });

  useEffect(() => {
    if (user) {
      fetchTemplates();
    }
  }, [user]);

  const fetchTemplates = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load templates. They will be created on first use.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async () => {
    if (!user?.id) return;

    setIsCreating(true);
    try {
      const templateData = {
        user_id: user.id,
        name: formData.name,
        description: formData.description || null,
        category: formData.category || null,
        event_type: formData.event_type || null,
        location: formData.location || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        expected_attendees: formData.expected_attendees ? parseInt(formData.expected_attendees) : null,
        description_template: formData.description_template || null,
      };

      const { data, error } = await supabase
        .from('event_templates')
        .insert([templateData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Template created successfully!',
      });

      setFormData({
        name: '',
        description: '',
        category: '',
        event_type: '',
        location: '',
        budget: '',
        expected_attendees: '',
        description_template: '',
      });
      setIsDialogOpen(false);
      fetchTemplates();
    } catch (error: any) {
      console.error('Error creating template:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create template',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('event_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Template deleted successfully!',
      });

      fetchTemplates();
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive',
      });
    }
  };

  const useTemplate = (template: EventTemplate) => {
    // Navigate to create event page with template data
    const params = new URLSearchParams({
      template: template.id,
      name: template.name,
      ...(template.category && { category: template.category }),
      ...(template.event_type && { event_type: template.event_type }),
      ...(template.location && { location: template.location }),
      ...(template.budget && { budget: template.budget.toString() }),
      ...(template.expected_attendees && { attendees: template.expected_attendees.toString() }),
    });
    navigate(`/create-event?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Event Templates</h2>
          <p className="text-muted-foreground">Save and reuse event configurations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Event Template</DialogTitle>
              <DialogDescription>
                Save your event configuration to reuse later
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Corporate Conference"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Template description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="event_type">Event Type</Label>
                  <Select value={formData.event_type} onValueChange={(value) => setFormData({ ...formData, event_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="party">Party</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Default location"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="attendees">Expected Attendees</Label>
                  <Input
                    id="attendees"
                    type="number"
                    value={formData.expected_attendees}
                    onChange={(e) => setFormData({ ...formData, expected_attendees: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description_template">Description Template</Label>
                <Textarea
                  id="description_template"
                  value={formData.description_template}
                  onChange={(e) => setFormData({ ...formData, description_template: e.target.value })}
                  placeholder="Template for event description"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createTemplate} disabled={!formData.name || isCreating}>
                  {isCreating ? 'Creating...' : 'Create Template'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create reusable event templates to speed up your event planning
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.category && (
                      <Badge variant="secondary" className="mt-2">
                        {template.category}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTemplate(template.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {template.description && (
                  <CardDescription>{template.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {template.event_type && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {template.event_type}
                    </div>
                  )}
                  {template.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {template.location}
                    </div>
                  )}
                  {template.expected_attendees && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      {template.expected_attendees} attendees
                    </div>
                  )}
                  {template.budget && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="mr-2 h-4 w-4" />
                      ${template.budget.toLocaleString()}
                    </div>
                  )}
                </div>
                <Button
                  className="w-full"
                  onClick={() => useTemplate(template)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

