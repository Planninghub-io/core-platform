
import { useNavigate } from "react-router-dom";
import { EventGeneratorContainer } from "./components/sections/EventGeneratorContainer";

interface EventGeneratorSectionProps {
  onCreateManualEvent?: () => void;
}

const EventGeneratorSection = ({ onCreateManualEvent }: EventGeneratorSectionProps) => {
  const navigate = useNavigate();
  
  // Create a handler for manual event creation
  const handleCreateManualEvent = () => {
    navigate('/create-event');
  };

  return (
    <EventGeneratorContainer 
      onCreateManualEvent={onCreateManualEvent || handleCreateManualEvent} 
    />
  );
};

// Make sure we have a proper default export
export default EventGeneratorSection;
