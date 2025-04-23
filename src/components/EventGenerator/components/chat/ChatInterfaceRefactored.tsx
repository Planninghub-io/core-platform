
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

  // Debug logging for monitoring state
  useEffect(() => {
    console.log("ChatInterface: Current state check:", {
      generatedEvent: props.generatedEvent ? "YES" : "NO",
      showDialog: showEventForm,
      promptCount: props.promptCount,
      lastPromptCount: lastPromptCountRef.current
    });
  }, [props.generatedEvent, showEventForm, props.promptCount]);

  // Effect to show dialog when a new event is generated
  useEffect(() => {
    if (props.generatedEvent) {
      console.log("Generated event detected:", props.generatedEvent);
      
      // Update local state with event data
      setEventTitleLocal(props.eventTitle || props.generatedEvent.title || "");
      setSelectedDateLocal(props.generatedEvent.date || "");
      setLocationLocal(props.generatedEvent.location || "");
      
      // Create a "fingerprint" of the current event to detect changes
      const eventFingerprint = JSON.stringify({
        title: props.generatedEvent.title,
        date: props.generatedEvent.date,
        location: props.generatedEvent.location,
        description: props.generatedEvent.description?.substring(0, 50), // Use part of description to detect changes
        promptCount: props.promptCount
      });
      
      // Check if this is a new event or prompt count changed
      const isNewEvent = (
        eventFingerprint !== lastProcessedEventRef.current || 
        props.promptCount > lastPromptCountRef.current
      );
      
      console.log("Event check:", { 
        isNewEvent, 
        lastFingerprint: lastProcessedEventRef.current,
        currentFingerprint: eventFingerprint,
        lastPromptCount: lastPromptCountRef.current,
        currentPromptCount: props.promptCount
      });
      
      if (isNewEvent) {
        console.log("NEW EVENT DETECTED - showing form dialog!");
        lastProcessedEventRef.current = eventFingerprint;
        lastPromptCountRef.current = props.promptCount;
        
        // Force dialog to show with a slight delay to ensure state is updated
        setTimeout(() => {
          setShowEventForm(true);
          console.log("Dialog visibility set to:", true);
        }, 300);
      }
    }
  }, [props.generatedEvent, props.promptCount, props.eventTitle]);

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

      {/* Event Form Review Dialog - FIXED with forceMount and important controls */}
      <Dialog 
        open={showEventForm && !!props.generatedEvent} 
        onOpenChange={(open) => {
          console.log("Dialog visibility changing to:", open);
          setShowEventForm(open);
        }}
      >
        <DialogContent 
          className="sm:max-w-2xl"
          onInteractOutside={(e) => {
            e.preventDefault(); // Prevent closing by clicking outside
            console.log("Outside interaction prevented");
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault(); // Prevent closing with escape key
            console.log("Escape key prevented");
          }}
        >
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
              onClick={() => {
                console.log("Review & Submit button clicked");
                setShowEventForm(true);
              }}
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
