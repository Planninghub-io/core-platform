
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
  
  const generatedEventRef = useRef<string | null>(null);

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

  useEffect(() => {
    if (props.generatedEvent) {
      setEventTitleLocal(props.eventTitle || props.generatedEvent.title || "");
      setSelectedDateLocal(props.generatedEvent.date || "");
      setLocationLocal(props.generatedEvent.location || "");
      
      const eventId = JSON.stringify(props.generatedEvent);
      if (eventId !== generatedEventRef.current) {
        generatedEventRef.current = eventId;
        
        console.log("Displaying event form for new generated event:", props.generatedEvent);
        const timer = setTimeout(() => {
          setShowEventForm(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [props.generatedEvent, props.eventTitle]);

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

  useEffect(() => {
    console.log("ChatInterfaceRefactored: Current generatedEvent state:", props.generatedEvent);
    console.log("ChatInterfaceRefactored: Dialog state:", showEventForm);
  }, [props.generatedEvent, showEventForm]);

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

      {props.generatedEvent && (
        <div className="mt-6 p-4 bg-white shadow-md border border-gray-200 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Your Generated Event</h2>
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
            handleCreateEvent={props.handleCreateEvent || (() => {})}
            prompt={props.prompt}
          />
        </div>
      )}

      <Dialog open={showEventForm && !!props.generatedEvent} onOpenChange={setShowEventForm}>
        <DialogContent className="sm:max-w-2xl">
          {props.generatedEvent && (
            <EventFormReview
              event={props.generatedEvent}
              eventTitle={eventTitle}
              setEventTitle={setEventTitleLocal}
              onClose={() => setShowEventForm(false)}
              onSubmit={() => {
                if (props.handleCreateEvent) {
                  props.handleCreateEvent();
                }
                setShowEventForm(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
