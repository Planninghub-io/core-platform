
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, LayoutDashboard, Bot, Save, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  hasUnsavedChanges: boolean;
  onSaveChanges: () => void;
  onCancelChanges: () => void;
}

export const EventHeader = ({
  isEditing,
  onBack,
  onEditToggle,
  onDashboard,
  onAiAssistant,
  activeView,
  hasUnsavedChanges,
  onSaveChanges,
  onCancelChanges
}: EventHeaderProps) => {
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'dashboard' | 'ai' | 'back' | null>(null);
  const { toast } = useToast();

  const handleActionWithCheck = (action: 'dashboard' | 'ai' | 'back') => {
    if (isEditing && hasUnsavedChanges) {
      setPendingAction(action);
      setShowUnsavedDialog(true);
    } else {
      executeAction(action);
    }
  };

  const executeAction = (action: 'dashboard' | 'ai' | 'back') => {
    switch (action) {
      case 'dashboard':
        onDashboard();
        break;
      case 'ai':
        onAiAssistant();
        break;
      case 'back':
        onBack();
        break;
    }
  };

  const handleSaveAndContinue = () => {
    onSaveChanges();
    toast({
      description: "Changes saved successfully",
    });
    if (pendingAction) {
      executeAction(pendingAction);
      setPendingAction(null);
    }
    setShowUnsavedDialog(false);
  };

  const handleDiscardAndContinue = () => {
    onCancelChanges();
    toast({
      description: "Changes discarded",
    });
    if (pendingAction) {
      executeAction(pendingAction);
      setPendingAction(null);
    }
    setShowUnsavedDialog(false);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            onClick={() => handleActionWithCheck('back')}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-2 -ml-2"
            size="icon"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant={activeView === 'dashboard' ? "default" : "outline"} 
            onClick={() => handleActionWithCheck('dashboard')}
            className={activeView === 'dashboard' ? "bg-[#8B5CF6] hover:bg-[#7C3AED]" : "text-[#8B5CF6] border-[#8B5CF6] hover:bg-purple-50"}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            variant={activeView === 'ai' ? "default" : "outline"} 
            onClick={() => handleActionWithCheck('ai')}
            className={activeView === 'ai' ? "bg-[#8B5CF6] hover:bg-[#7C3AED]" : "text-[#8B5CF6] border-[#8B5CF6] hover:bg-purple-50"}
          >
            <Bot className="mr-2 h-4 w-4" />
            AI Assistant
          </Button>
        </div>

        <div className="flex gap-2">
          {isEditing && hasUnsavedChanges && (
            <>
              <Button 
                variant="ghost"
                onClick={onCancelChanges}
                className="text-gray-500"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                variant="outline"
                onClick={onSaveChanges}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </>
          )}
          <Button 
            variant={isEditing ? "default" : "outline"}
            onClick={onEditToggle}
            className={isEditing ? "bg-amber-500 hover:bg-amber-600" : "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"}
          >
            <Pencil className="mr-2 h-4 w-4" />
            {isEditing ? "Done" : "Edit"}
          </Button>
        </div>
      </div>

      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Would you like to save them before continuing?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDiscardAndContinue}>Discard Changes</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveAndContinue}>Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
