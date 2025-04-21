
import { useState, useEffect } from "react";
import { ChatContainer } from "./ChatContainer";
import { ChatInputArea } from "./ChatInputArea";
import { usePromptHandler } from "./PromptHandler";
import { EventFormReview } from "../EventFormReview";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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

  // Use the prompt handler hook
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

  // Handle model change
  const handleModelChange = (model: 'openai' | 'anthropic') => {
    if (model === modelProvider) return;

    setModelProvider(model);
    if (props.onModelChange) {
      props.onModelChange(model);
    }
  };

  // Show event form when all requirements are met
  useEffect(() => {
    if (props.generatedEvent && !props.isGenerating) {
      console.log("ChatInterfaceRefactored: Generated event available:", props.generatedEvent);
      const timer = setTimeout(() => {
        setShowEventForm(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [props.generatedEvent, props.isGenerating]);

  // Debug event rendering
  useEffect(() => {
    console.log("ChatInterfaceRefactored: Current generatedEvent state:", props.generatedEvent);
    console.log("ChatInterfaceRefactored: Dialog state:", showEventForm);
  }, [props.generatedEvent, showEventForm]);

  // Unified container: one border/background, rounded corners, no gap
  return (
    <div className="w-full min-h-[70vh] max-h-[85vh] flex flex-col">
      <div className="flex flex-col flex-grow bg-white shadow-md border border-gray-200 rounded-xl overflow-hidden w-full h-full">
        <div className="flex-grow overflow-hidden">
          <ChatContainer
            chatMessages={props.chatMessages}
            isGenerating={props.isGenerating}
            promptCount={props.promptCount}
            welcomeMessage={props.welcomeMessage}
            generatedEvent={props.generatedEvent}
            requiredFieldsCollected={requiredFieldsCollected}
            hasMissingFields={hasMissingFields}
            onTranscriptReceived={props.onTranscriptReceived}
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
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="sm:max-w-2xl">
          {props.generatedEvent && (
            <EventFormReview
              event={props.generatedEvent}
              eventTitle={props.eventTitle || ''}
              setEventTitle={props.setEventTitle}
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
