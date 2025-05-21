
import { Sparkles } from "lucide-react";

interface WelcomeHeaderProps {
  show: boolean;
}

export const WelcomeHeader = ({ show }: WelcomeHeaderProps) => {
  if (!show) return null;
  
  return (
    <div className="text-center mb-6"> {/* reduced bottom margin */}
      <h1 className="animate-fade-down mb-4 text-3xl md:text-4xl font-bold text-gray-900"> {/* reduced font size and margin */}
        Welcome to Your AI Event Planner!
      </h1>
      <p className="animate-fade-up mb-4 text-lg text-gray-600"> {/* reduced bottom margin */}
        Just type in the event details in the chat and I'll help you bring it to life!
      </p>
    </div>
  );
};
