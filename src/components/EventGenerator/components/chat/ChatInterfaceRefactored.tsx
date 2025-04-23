
import { useState, useEffect, useRef } from "react";
import { ChatContainer } from "./ChatContainer";
import { ChatInputArea } from "./ChatInputArea";
import { usePromptHandler } from "./PromptHandler";
import { EventFormReview } from "../EventFormReview";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventDetailsForm } from "../EventDetailsForm";

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
  
  const generatedEventRef = useRef<any>(null);
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

  // Effect to show dialog when a new event is generated
  useEffect(() => {
    if (props.generatedEvent) {
      // Update local state with event data
      setEventTitleLocal(props.eventTitle || props.generatedEvent.title || "");
      setSelectedDateLocal(props.generatedEvent.date || "");
      setLocationLocal(props.generatedEvent.location || "");
      
      // Check if this is a new event (comparing with previous event or prompt count)
      const isNewEvent = (
        !generatedEventRef.current || 
        JSON.stringify(props.generatedEvent) !== JSON.stringify(generatedEventRef.current) ||
        props.promptCount > lastPromptCountRef.current
      );
      
      if (isNewEvent) {
        console.log("New event detected, showing dialog:", props.generatedEvent);
        generatedEventRef.current = props.generatedEvent;
        lastPromptCountRef.current = props.promptCount;
        
        // Show dialog with a short delay to ensure state updates are complete
        const timer = setTimeout(() => {
          setShowEventForm(true);
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [props.generatedEvent, props.eventTitle, props.promptCount]);

  // Effect to sync local state with parent props
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

  // Debug logging
  useEffect(() => {
    console.log("ChatInterfaceRefactored: Current state:", {
      generatedEvent: props.generatedEvent,
      showDialog: showEventForm,
      promptCount: props.promptCount
    });
  }, [props.generatedEvent, showEventForm, props.promptCount]);

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

      {/* Event Form Review Dialog */}
      <Dialog 
        open={showEventForm && !!props.generatedEvent} 
        onOpenChange={(open) => {
          setShowEventForm(open);
          console.log("Dialog open state changed to:", open);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          {props.generatedEvent && (
            <EventFormReview
              event={props.generatedEvent}
              eventTitle={eventTitle}
              setEventTitle={setEventTitleLocal}
              onClose={() => {
                console.log("Closing event form dialog");
                setShowEventForm(false);
              }}
              onSubmit={() => {
                console.log("Submit button clicked in event form dialog");
                if (props.handleCreateEvent) {
                  props.handleCreateEvent();
                }
                setShowEventForm(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Also display the event details in the main view for users to reference */}
      {props.generatedEvent && (
        <div className="mt-6 p-4 bg-white shadow-md border border-gray-200 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
            <span>Your Generated Event</span>
            <button
              onClick={() => setShowEventForm(true)}
              className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition-colors"
            >
              Review & Submit
            </button>
          </h2>
          <EventDetailsForm
            event={props.generatedEvent}
            eventTitle={eventTitle}
            setEventTitle={setEventTitleLocal}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDateLocal}
            location={location}
            setLocation={setLocationLocal}
            hasMissingDate={!selectedDate && !props.generatedEvent.date}
            hasMissingLocation={!location && !props.generatedEvent.location}
            isCreating={false}
            handleCreateEvent={() => {
              if (props.handleCreateEvent) {
                props.handleCreateEvent();
              }
            }}
            prompt={props.prompt}
          />
        </div>
      )}
    </div>
  );
};
