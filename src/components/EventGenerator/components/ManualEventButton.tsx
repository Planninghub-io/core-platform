
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ManualEventButtonProps {
  show: boolean;
  onClick: () => void;
}

export const ManualEventButton = ({ show, onClick }: ManualEventButtonProps) => {
  if (!show) return null;
  
  return (
    <div className="flex justify-center">
      <Button
        onClick={onClick}
        className="animate-fade-up gap-2 bg-[#9b87f5] hover:bg-[#9b87f5]/90"
        size="lg"
      >
        Create event on my own
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
