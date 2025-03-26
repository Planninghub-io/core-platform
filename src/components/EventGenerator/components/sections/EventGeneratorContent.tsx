
import { ChatInterface } from "../ChatInterface";
import { EventDetailsSection } from "./EventDetailsSection";
import { useEventGeneration } from "@/hooks/event-generation";

interface EventGeneratorContentProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  generatedEvent: any | null;
  eventTitle: string;
  setEventTitle: (title: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  location: string;
  setLocation: (location: string) => void;
  hasMissingDate: boolean;
  hasMissingLocation: boolean;
  handleCreateEvent: () => void;
  latestPrompt: string;
  modelProvider: 'openai' | 'anthropic';
  onModelChange: (model: 'openai' | 'anthropic') => void;
  promptCount: number;
}

export const EventGeneratorContent = ({
  chatMessages,
  generatedEvent,
  eventTitle,
  setEventTitle,
  selectedDate,
  setSelectedDate,
  location,
  setLocation,
  hasMissingDate,
  hasMissingLocation,
  handleCreateEvent,
  latestPrompt,
  modelProvider,
  onModelChange,
  promptCount
}: EventGeneratorContentProps) => {
  const { prompt, setPrompt, isGenerating, handlePromptSubmit } = useEventGeneration();

  // Updated welcome message
  const welcomeMessage = chatMessages.length === 0 ? 
    "Hi, please provide your event details including place, date & time to get started with planning." : "";

  // Handle prompt submission with the selected model
  const handleSubmit = (selectedModel?: 'openai' | 'anthropic') => {
    console.log("EventGeneratorContent: handleSubmit called with model:", selectedModel || modelProvider);
    // Use the model selected in the UI component if provided, otherwise fall back to the prop
    handlePromptSubmit(selectedModel || modelProvider);
  };

  return (
    <>
      <ChatInterface
        chatMessages={chatMessages}
        prompt={prompt}
        setPrompt={setPrompt}
        isGenerating={isGenerating}
        promptCount={promptCount}
        handlePromptSubmit={handleSubmit}
        welcomeMessage={welcomeMessage}
        generatedEvent={generatedEvent}
        modelProvider={modelProvider}
        onModelChange={onModelChange}
      />

      {/* Generated Event Data */}
      {generatedEvent && (
        <EventDetailsSection
          generatedEvent={generatedEvent}
          eventTitle={eventTitle}
          setEventTitle={setEventTitle}
          selectedDate={selectedDate || generatedEvent.date}
          setSelectedDate={setSelectedDate}
          location={location || generatedEvent.location}
          setLocation={setLocation}
          hasMissingDate={hasMissingDate}
          hasMissingLocation={hasMissingLocation}
          isCreating={false}
          handleCreateEvent={handleCreateEvent}
          prompt={latestPrompt}
        />
      )}
    </>
  );
};
