
import React from "react";
import { Button } from "@/components/ui/button";
import { ListChecks, RefreshCw } from "lucide-react";

interface EmptyChecklistProps {
  onGenerateChecklist: () => void;
  isLoading: boolean;
}

export const EmptyChecklist: React.FC<EmptyChecklistProps> = ({ 
  onGenerateChecklist, 
  isLoading 
}) => {
  return (
    <div className="text-center py-8">
      <ListChecks className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No checklist items</h3>
      <p className="mt-1 text-sm text-gray-500">
        Generate a checklist based on your event details or add items manually.
      </p>
      <div className="mt-6">
        <Button 
          onClick={onGenerateChecklist} 
          disabled={isLoading}
          className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Checklist
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
