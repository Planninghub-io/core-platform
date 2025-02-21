
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, LayoutDashboard, Bot } from "lucide-react";

interface EventHeaderProps {
  isEditing: boolean;
  id: string;
  onBack: () => void;
  onEditToggle: () => void;
  onDashboard: () => void;
  onAiPlanner: () => void;
}

export const EventHeader = ({
  isEditing,
  id,
  onBack,
  onEditToggle,
  onDashboard,
  onAiPlanner
}: EventHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>
      
      <div className="flex gap-2">
        <Button 
          variant={isEditing ? "default" : "outline"}
          onClick={onEditToggle}
        >
          <Pencil className="mr-2 h-4 w-4" />
          {isEditing ? "Done" : "Edit"}
        </Button>
        <Button variant="outline" onClick={onDashboard}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button variant="outline" onClick={onAiPlanner}>
          <Bot className="mr-2 h-4 w-4" />
          AI Planner
        </Button>
      </div>
    </div>
  );
};
