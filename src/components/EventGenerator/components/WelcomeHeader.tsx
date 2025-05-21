
interface WelcomeHeaderProps {
  show: boolean;
}

export const WelcomeHeader = ({ show }: WelcomeHeaderProps) => {
  if (!show) return null;
  
  return (
    <div className="text-center mb-6"> {/* reduced bottom margin */}
      <h1 className="animate-fade-down mb-4 text-3xl md:text-4xl font-bold text-gray-900"> {/* reduced font size and margin */}
        What can I help you plan today?
      </h1>
      <p className="animate-fade-up mb-4 text-lg text-gray-600"> {/* reduced bottom margin */}
        Create, discover, and experience amazing events. Start your journey with us today.
      </p>
    </div>
  );
};
