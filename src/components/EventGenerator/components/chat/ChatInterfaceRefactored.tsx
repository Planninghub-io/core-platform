
import { useState, useEffect, useRef } from "react";
import { ChatContainer } from "./ChatContainer";
import { ChatInputArea } from "./ChatInputArea";
import { usePromptHandler } from "./PromptHandler";
import { EventReviewDialog } from "./EventReviewDialog";
import { GeneratedEventSummary } from "./GeneratedEventSummary";
import { toast } from "sonner";

interface ChatInterfaceProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string, id?: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: (prompt: string, modelProvider?: 'openai' | 'anthropic') => void;
  welcomeMessage: string;
  generatedEvent: any | null;
  modelProvider?: 'openai' | 'anthropic';
  onModelChange?: (model: 'openai' | 'anthropic') => void;
  setChatMessages: React.Dispatch<React.SetStateAction<Array<{ type: 'user' | 'ai', content: string, id?: string }>>>;
  setSelectedDate?: (date: string) => void;
  setLocation?: (location: string) => void;
  eventTitle?: string;
  setEventTitle?: (title: string) => void;
  handleCreateEvent?: () => void;
  onTranscriptReceived?: (transcript: string) => void;
}

export const ChatInterfaceRefactored = (props: ChatInterfaceProps) => {
  const [modelProvider, setModelProvider] = useState<'openai' | 'anthropic'>(props.modelProvider || 'openai');
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDateLocal] = useState(props.generatedEvent?.date || "");
  const [location, setLocationLocal] = useState(props.generatedEvent?.location || "");
  const [eventTitle, setEventTitleLocal] = useState(props.eventTitle || props.generatedEvent?.title || "");

  const lastProcessedEventRef = useRef<string | null>(null);
  const lastPromptCountRef = useRef<number>(props.promptCount || 0);

  const {
    handleSubmit,
    pendingInfo,
    requiredFieldsCollected,
    hasMissingFields
  } = usePromptHandler({
    setChatMessages: props.setChatMessages,
    setSelectedDate: props.setSelectedDate,
    setLocation: props.setLocation,
    setPrompt: props.setPrompt,
    handlePromptSubmit: props.handlePromptSubmit,
    modelProvider
  });

  const handleModelChange = (model: 'openai' | 'anthropic') => {
    if (model === modelProvider) return;
    setModelProvider(model);
    if (props.onModelChange) {
      props.onModelChange(model);
    }
  };

  // Debug logging to track state
  useEffect(() => {
    console.log("ChatInterface: Current state check:", {
      generatedEvent: props.generatedEvent ? "YES" : "NO",
      generatedEventTitle: props.generatedEvent?.title,
      generatedEventDate: props.generatedEvent?.date,
      generatedEventLocation: props.generatedEvent?.location,
      showDialog: showEventForm,
      promptCount: props.promptCount,
      lastPromptCount: lastPromptCountRef.current,
      eventTitle,
      selectedDate,
      location
    });
  }, [props.generatedEvent, showEventForm, props.promptCount, eventTitle, selectedDate, location]);

  // Update local state when generated event changes
  useEffect(() => {
    if (props.generatedEvent) {
      // Force update local state with generated event data
      setEventTitleLocal(props.generatedEvent.title || eventTitle || "");
      setSelectedDateLocal(props.generatedEvent.date || selectedDate || "");
      setLocationLocal(props.generatedEvent.location || location || "");
      
      const eventFingerprint = JSON.stringify({
        title: props.generatedEvent.title,
        date: props.generatedEvent.date,
        location: props.generatedEvent.location,
        description: props.generatedEvent.description?.substring(0, 50),
        promptCount: props.promptCount
      });
      
      const isNewEvent = (
        eventFingerprint !== lastProcessedEventRef.current || 
        props.promptCount > lastPromptCountRef.current
      );
      
      if (isNewEvent) {
        console.log("New event detected, showing form:", eventFingerprint);
        lastProcessedEventRef.current = eventFingerprint;
        lastPromptCountRef.current = props.promptCount;
        
        // Show the event form after a short delay
        setTimeout(() => {
          setShowEventForm(true);
        }, 300);
      }
    }
  }, [props.generatedEvent, props.promptCount]);

  // Sync local state with parent props when they change
  useEffect(() => {
    if (props.setSelectedDate && selectedDate) {
      props.setSelectedDate(selectedDate);
    }
    if (props.setLocation && location) {
      props.setLocation(location);
    }
    if (props.setEventTitle && eventTitle) {
      props.setEventTitle(eventTitle);
    }
  }, [selectedDate, location, eventTitle, props.setSelectedDate, props.setLocation, props.setEventTitle]);

  // Handle create event function with validation
  const onCreateEvent = () => {
    console.log("Attempting to create event with:", {
      title: eventTitle,
      date: selectedDate,
      location: location
    });
    
    if (!eventTitle || !eventTitle.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    
    if (props.handleCreateEvent) {
      console.log("Calling handleCreateEvent from parent");
      props.handleCreateEvent();
    } else {
      console.error("No handleCreateEvent function provided");
      toast.error("Unable to create event: Setup not complete");
    }
  };

  return (
    <div className="w-full min-h-[50vh] max-h-[85vh] flex flex-col">
      <div className="flex flex-col flex-grow bg-white shadow-md border border-gray-200 rounded-xl overflow-hidden w-full relative">
        <div className="flex-grow overflow-hidden relative">
          <ChatContainer
            chatMessages={props.chatMessages}
            isGenerating={props.isGenerating}
            promptCount={props.promptCount}
            welcomeMessage={props.welcomeMessage}
            generatedEvent={props.generatedEvent}
            requiredFieldsCollected={requiredFieldsCollected}
            hasMissingFields={hasMissingFields}
            onTranscriptReceived={props.onTranscriptReceived}
            modelProvider={modelProvider}
            onModelChange={handleModelChange}
          />
        </div>
        <div className="border-t border-gray-200">
          <ChatInputArea
            chatMessages={props.chatMessages}
            prompt={props.prompt}
            setPrompt={props.setPrompt}
            isGenerating={props.isGenerating}
            promptCount={props.promptCount}
            handlePromptSubmit={handleSubmit}
            generatedEvent={props.generatedEvent}
            hasMissingFields={hasMissingFields}
            requiredFieldsCollected={requiredFieldsCollected}
            modelProvider={modelProvider}
            onModelChange={handleModelChange}
          />
        </div>
      </div>

      <EventReviewDialog
        open={showEventForm && !!props.generatedEvent}
        generatedEvent={props.generatedEvent}
        eventTitle={eventTitle}
        setEventTitle={setEventTitleLocal}
        onClose={() => setShowEventForm(false)}
        onSubmit={() => {
          onCreateEvent();
          setShowEventForm(false);
        }}
      />

      {props.generatedEvent && (
        <GeneratedEventSummary
          generatedEvent={props.generatedEvent}
          eventTitle={eventTitle}
          setEventTitle={setEventTitleLocal}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDateLocal}
          location={location}
          setLocation={setLocationLocal}
          hasMissingDate={!selectedDate && !props.generatedEvent.date}
          hasMissingLocation={!location && !props.generatedEvent.location}
          handleCreateEvent={onCreateEvent}
          prompt={props.prompt}
          onReview={() => setShowEventForm(true)}
        />
      )}
    </div>
  );
};
