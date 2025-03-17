
interface WelcomeHeaderProps {
  show: boolean;
}

export const WelcomeHeader = ({ show }: WelcomeHeaderProps) => {
  if (!show) return null;
  
  return (
    <div className="text-center mb-10">
      <h1 className="animate-fade-down mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
        What can I help you plan today?
      </h1>
      <p className="animate-fade-up mb-8 text-lg text-gray-600">
        Create, discover, and experience amazing events. Start your journey with us today.
      </p>
    </div>
  );
};
