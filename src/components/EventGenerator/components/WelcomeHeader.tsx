
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
      <h1 className="animate-fade-down mb-4 text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#F97316] bg-clip-text text-transparent">
        Let's Plan Your Perfect Event!
      </h1>
      <p className="animate-fade-up mb-4 text-lg text-gray-700 font-medium">
        Share your event ideas in the chat and I'll help make them a reality! ✨
      </p>
    </div>
  );
};
