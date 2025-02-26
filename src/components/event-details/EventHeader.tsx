
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, LayoutDashboard, Bot, Trash2 } from "lucide-react";
import { EventAIDialog } from "./EventAIDialog";

interface EventHeaderProps {
  isEditing: boolean;
  id: string;
  onBack: () => void;
  onEditToggle: () => void;
  onDashboard: () => void;
  onAiPlanner: () => void;
  onDelete?: () => void;
  status?: string;
  event: {
    title: string;
    date: string;
    end_date: string;
    description: string | null;
    location: string | null;
    category: string | null;
    expected_attendees: number | null;
  };
}

export const EventHeader = ({
  isEditing,
  id,
  onBack,
  onEditToggle,
  onDashboard,
  onAiPlanner,
  onDelete,
  status,
  event
}: EventHeaderProps) => {
  const showDeleteOption = isEditing && onDelete && status !== 'completed';

  return (
    <div className="space-y-4 mb-6">
      <Button variant="ghost" onClick={onBack} className="px-3">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onDashboard}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <EventAIDialog event={event} />
        </div>

        <div className="flex gap-2">
          <Button 
            variant={isEditing ? "default" : "outline"}
            onClick={onEditToggle}
          >
            <Pencil className="mr-2 h-4 w-4" />
            {isEditing ? "Done" : "Edit"}
          </Button>
          {showDeleteOption && (
            <Button 
              variant="destructive" 
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
