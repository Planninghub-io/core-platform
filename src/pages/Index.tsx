
import { EventGeneratorContainer } from "@/components/EventGenerator/components/sections/EventGeneratorContainer";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`
      min-h-screen bg-gradient-to-br from-gray-50 to-gray-100
      ${isMobile ? 'px-2 py-2' : 'px-4 py-6'}
    `}>
      <div className="h-full w-full max-w-7xl mx-auto">
        <EventGeneratorContainer 
          onCreateManualEvent={() => window.location.href = "/create-event"}
        />
      </div>
    </div>
  );
};

export default Index;
