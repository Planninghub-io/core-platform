
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, User, Users } from "lucide-react";
import { getDisplayName } from "@/utils/userUtils";
import type { UserProfile } from "@/types/user";

interface EventInfoProps {
  event: {
    title: string;
    date: string;
    location: string | null;
    expected_attendees: number | null;
    description: string | null;
    category: string | null;
    user_profiles?: UserProfile | null;
  };
  isEditing: boolean;
  onFieldChange: (field: string, value: string | number) => void;
}

export const EventInfo = ({ event, isEditing, onFieldChange }: EventInfoProps) => {
  return (
    <div className="space-y-6">
      <div>
        {isEditing ? (
          <Input
            type="text"
            value={event.title}
            onChange={(e) => onFieldChange('title', e.target.value)}
            className="text-3xl font-bold mb-2"
          />
        ) : (
          <h1 className="mb-2 text-3xl font-bold">{event.title}</h1>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <span>Created by {event.user_profiles ? getDisplayName(event.user_profiles) : 'Unknown'}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {isEditing ? (
            <Input
              type="datetime-local"
              value={new Date(event.date).toISOString().slice(0, 16)}
              onChange={(e) => onFieldChange('date', e.target.value)}
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
              onChange={(e) => onFieldChange('location', e.target.value)}
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
              onChange={(e) => onFieldChange('expected_attendees', parseInt(e.target.value))}
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
            onChange={(e) => onFieldChange('description', e.target.value)}
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
            onChange={(e) => onFieldChange('category', e.target.value)}
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
  );
};
