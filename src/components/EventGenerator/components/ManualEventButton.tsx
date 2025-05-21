
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
        className="animate-fade-up gap-2 bg-[#9b87f5] hover:bg-[#9b87f5]/90 py-6 px-8"
        size="lg"
      >
        <span className="text-lg">Create event on my own</span>
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
