
import React, { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ChatMessages } from "./ChatMessages";
import { ChatInputArea } from "./ChatInputArea";
import { ModelDropdown } from "./ModelDropdown";
import { GeneratedEventSummary } from "./GeneratedEventSummary";
import { SignUpPrompt } from "./SignUpPrompt";
import { usePromptHandler } from "./PromptHandler";

interface ChatInterfaceRefactoredProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string, id?: string }>;
  setChatMessages: React.Dispatch<React.SetStateAction<Array<{ type: 'user' | 'ai', content: string, id?: string }>>>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: (prompt: string, modelProvider?: 'openai' | 'anthropic') => void;
  welcomeMessage?: string;
  generatedEvent?: any;
  onTranscriptReceived?: (transcript: string) => void;
  setSelectedDate?: (date: string) => void;
  setLocation?: (location: string) => void;
  modelProvider?: 'openai' | 'anthropic';
  onModelChange?: (model: 'openai' | 'anthropic') => void;
  eventTitle?: string;
  setEventTitle?: (title: string) => void;
  handleCreateEvent?: () => void;
  showSignUpPrompt?: boolean;
}

export const ChatInterfaceRefactored = ({
  chatMessages,
  setChatMessages,
  prompt,
  setPrompt,
  isGenerating,
  promptCount,
  handlePromptSubmit,
  welcomeMessage = "",
  generatedEvent,
  onTranscriptReceived,
  setSelectedDate,
  setLocation,
  modelProvider = 'openai',
  onModelChange,
  eventTitle,
  setEventTitle,
  handleCreateEvent,
  showSignUpPrompt = false
}: ChatInterfaceRefactoredProps) => {
  const [isSpeechRecognitionAvailable, setIsSpeechRecognitionAvailable] = useState(false);
  
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Use the prompt handler which will check for required fields
  const {
    handleSubmit,
    pendingInfo,
    requiredFieldsCollected,
    hasMissingFields
  } = usePromptHandler({
    setChatMessages,
    setSelectedDate,
    setLocation,
    setPrompt,
    handlePromptSubmit,
    modelProvider
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setIsSpeechRecognitionAvailable(true);
    }
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Add model selector to the top of the card
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md border border-gray-200 rounded-lg">
      {/* Added model selector in the header for visibility */}
      <div className="flex justify-between items-center border-b border-gray-100 p-2">
        <p className="text-sm font-medium ml-2">AI Event Planner</p>
        {onModelChange && (
          <ModelDropdown
            modelProvider={modelProvider}
            onModelChange={onModelChange || (() => {})}
          />
        )}
      </div>

      {/* Chat messages with flexible height */}
      <div className="flex-1 overflow-y-auto">
        <ChatMessages
          chatMessages={chatMessages}
          isGenerating={isGenerating}
          welcomeMessage={welcomeMessage}
          modelProvider={modelProvider}
          onModelChange={onModelChange}
        />
      </div>
      
      {generatedEvent ? (
        <div className="p-3 border-t border-gray-200">
          <GeneratedEventSummary
            generatedEvent={generatedEvent}
            eventTitle={eventTitle || ''}
            setEventTitle={setEventTitle || (() => {})}
            handleCreateEvent={handleCreateEvent || (() => {})}
            selectedDate={''}
            setSelectedDate={setSelectedDate || (() => {})}
            location={''}
            setLocation={setLocation || (() => {})}
            hasMissingDate={false}
            hasMissingLocation={false}
            showDetailsForm={false}
          />
        </div>
      ) : showSignUpPrompt ? (
        <div className="px-4 pb-3">
          <SignUpPrompt 
            onSignUpIndividual={() => window.location.href = `/auth?type=user&redirectPath=/create-event`} 
            onSignUpBusiness={() => window.location.href = `/auth?type=business&redirectPath=/create-event`}
          />
        </div>
      ) : null}
      
      <div className="border-t border-gray-200">
        <ChatInputArea
          prompt={prompt}
          setPrompt={setPrompt}
          isGenerating={isGenerating}
          onSubmit={handleSubmit}
          promptCount={promptCount}
          chatMessages={chatMessages}
          onTranscriptReceived={onTranscriptReceived}
          modelProvider={modelProvider}
          onModelChange={onModelChange}
          hasMissingFields={hasMissingFields}
          requiredFieldsCollected={requiredFieldsCollected}
        />
      </div>
    </Card>
  );
};
