
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, MapPin, User, Users, Pencil, LayoutDashboard, Bot } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import debounce from "lodash/debounce";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles:user_id (
            email
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch event details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = debounce(async (updates: Partial<typeof event>) => {
    try {
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        description: "Changes saved successfully",
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  }, 1000);

  const handleInputChange = (field: string, value: string | number) => {
    setEvent(prev => ({ ...prev, [field]: value }));
    saveChanges({ [field]: value });
  };

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (!event) {
    return <div className="container py-8">Event not found</div>;
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost"
          onClick={() => navigate('/events-hub')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant={isEditing ? "default" : "outline"}
            onClick={() => navigate(isEditing ? `/event/${id}` : `/event/${id}?edit=true`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            {isEditing ? "Done" : "Edit"}
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(`/event/${id}/dashboard`)}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(`/event/${id}/ai-planner`)}
          >
            <Bot className="mr-2 h-4 w-4" />
            AI Planner
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-[16/9] overflow-hidden rounded-xl">
          {isEditing ? (
            <Input
              type="text"
              value={event.image_url || ''}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="Image URL"
              className="mb-4"
            />
          ) : (
            <img
              src={event.image_url || '/placeholder.svg'}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="space-y-6">
          <div>
            {isEditing ? (
              <Input
                type="text"
                value={event.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-3xl font-bold mb-2"
              />
            ) : (
              <h1 className="mb-2 text-3xl font-bold">{event.title}</h1>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Created by {event.profiles?.email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {isEditing ? (
                <Input
                  type="datetime-local"
                  value={new Date(event.date).toISOString().slice(0, 16)}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              ) : (
                <span>{new Date(event.date).toLocaleDateString()}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {isEditing ? (
                <Input
                  type="text"
                  value={event.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Location"
                />
              ) : (
                <span>{event.location}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {isEditing ? (
                <Input
                  type="number"
                  value={event.expected_attendees || ''}
                  onChange={(e) => handleInputChange('expected_attendees', parseInt(e.target.value))}
                  placeholder="Expected attendees"
                />
              ) : (
                <span>{event.expected_attendees || 'Not specified'} expected attendees</span>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">Description</h2>
            {isEditing ? (
              <Textarea
                value={event.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Event description"
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-muted-foreground">{event.description}</p>
            )}
          </div>

          <div className="rounded-lg bg-muted p-4">
            <span className="text-sm font-medium">Category:</span>
            {isEditing ? (
              <Input
                type="text"
                value={event.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="Category"
                className="ml-2 inline-block w-auto"
              />
            ) : (
              <span className="ml-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {event.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
