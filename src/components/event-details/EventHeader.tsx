
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, LayoutDashboard, Bot } from "lucide-react";

interface EventHeaderProps {
  isEditing: boolean;
  id: string;
  onBack: () => void;
  onEditToggle: () => void;
  onDashboard: () => void;
  onAiAssistant: () => void;
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
  activeView: 'details' | 'ai' | 'dashboard';
}

export const EventHeader = ({
  isEditing,
  onBack,
  onEditToggle,
  onDashboard,
  onAiAssistant,
  activeView
}: EventHeaderProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            variant={activeView === 'dashboard' ? "default" : "outline"} 
            onClick={onDashboard}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            variant={activeView === 'ai' ? "default" : "outline"} 
            onClick={onAiAssistant}
          >
            <Bot className="mr-2 h-4 w-4" />
            AI Assistant
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
        </div>
      </div>
    </div>
  );
};
