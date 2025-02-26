
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Event {
  id: string;
  title: string;
  date: string;
  end_date: string;
  description: string | null;
  location: string | null;
  category: string | null;
  expected_attendees: number | null;
  status?: string;
}

interface EventInfoProps {
  event: Event;
  isEditing: boolean;
  onFieldChange: (field: string, value: string | number) => void;
  onDelete?: () => void;
}

export const EventInfo = ({
  event,
  isEditing,
  onFieldChange,
  onDelete,
}: EventInfoProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          value={event.title}
          onChange={(e) => onFieldChange('title', e.target.value)}
          readOnly={!isEditing}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Start Date</Label>
          <Input
            id="date"
            type="datetime-local"
            value={event.date}
            onChange={(e) => onFieldChange('date', e.target.value)}
            readOnly={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="datetime-local"
            value={event.end_date}
            onChange={(e) => onFieldChange('end_date', e.target.value)}
            readOnly={!isEditing}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={event.location || ''}
          onChange={(e) => onFieldChange('location', e.target.value)}
          readOnly={!isEditing}
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={event.category || ''}
          onChange={(e) => onFieldChange('category', e.target.value)}
          readOnly={!isEditing}
        />
      </div>

      <div>
        <Label htmlFor="expected_attendees">Expected Attendees</Label>
        <Input
          id="expected_attendees"
          type="number"
          value={event.expected_attendees || ''}
          onChange={(e) => onFieldChange('expected_attendees', parseInt(e.target.value))}
          readOnly={!isEditing}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          className="w-full min-h-[100px] p-2 border rounded-md"
          value={event.description || ''}
          onChange={(e) => onFieldChange('description', e.target.value)}
          readOnly={!isEditing}
        />
      </div>

      {isEditing && onDelete && event.status !== 'completed' && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Event
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your event and remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
