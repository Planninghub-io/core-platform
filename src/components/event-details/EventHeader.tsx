
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, LayoutDashboard, Bot, Trash2 } from "lucide-react";

interface EventHeaderProps {
  isEditing: boolean;
  id: string;
  onBack: () => void;
  onEditToggle: () => void;
  onDashboard: () => void;
  onAiPlanner: () => void;
  onDelete?: () => void;
  status?: string;
}

export const EventHeader = ({
  isEditing,
  id,
  onBack,
  onEditToggle,
  onDashboard,
  onAiPlanner,
  onDelete,
  status
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
          <Button variant="outline" onClick={onAiPlanner}>
            <Bot className="mr-2 h-4 w-4" />
            AI Planner
          </Button>
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
