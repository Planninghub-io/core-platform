
import { Sparkles, PartyPopper } from "lucide-react";

interface WelcomeHeaderProps {
  show: boolean;
}

export const WelcomeHeader = ({ show }: WelcomeHeaderProps) => {
  if (!show) return null;
  
  return (
    <div className="text-center mb-6">
      <div className="flex justify-center mb-2">
        <div className="relative">
          <PartyPopper className="h-10 w-10 text-[#D946EF] animate-bounce" />
          <Sparkles className="h-5 w-5 text-[#F97316] absolute -top-2 -right-2 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
