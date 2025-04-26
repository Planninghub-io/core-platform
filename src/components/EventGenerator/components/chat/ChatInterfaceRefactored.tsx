
import React, { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ChatMessages } from "./ChatMessages";
import { ChatInputArea } from "./ChatInputArea";
import { ModelDropdown } from "./ModelDropdown";
import { GeneratedEventSummary } from "./GeneratedEventSummary";
import { SignUpPrompt } from "./SignUpPrompt";

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
  const [isSpeechRecognitionActive, setIsSpeechRecognitionActive] = useState(false);
  const [speechRecognitionTranscript, setSpeechRecognitionTranscript] = useState('');
  const [speechRecognitionError, setSpeechRecognitionError] = useState<string | null>(null);

  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window) {
      setIsSpeechRecognitionAvailable(true);
    } else if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      setIsSpeechRecognitionAvailable(true);
    }
  }, []);

  const handleSubmit = (input: string, modelProvider?: 'openai' | 'anthropic') => {
    if (input.trim()) {
      handlePromptSubmit(input, modelProvider);
      setPrompt('');
      if (inputRef.current) {
        inputRef.current.style.height = 'inherit';
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Card className="relative flex flex-col h-full overflow-hidden shadow-md border border-gray-200 rounded-lg">
      <div className="absolute top-3 right-3">
        <ModelDropdown
          modelProvider={modelProvider}
          onModelChange={onModelChange || (() => {})}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessages
          chatMessages={chatMessages}
          isGenerating={isGenerating}
          welcomeMessage={welcomeMessage}
        />
      </div>
      
      {generatedEvent ? (
        <div className="p-4 border-t border-gray-200">
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
        <div className="px-4 pb-4">
          <SignUpPrompt 
            onSignUpIndividual={() => window.location.href = `/auth?type=user&redirectPath=/create-event`} 
            onSignUpBusiness={() => window.location.href = `/auth?type=business&redirectPath=/create-event`}
          />
        </div>
      ) : null}
      
      <div className="p-4 border-t border-gray-200">
        <ChatInputArea
          prompt={prompt}
          setPrompt={setPrompt}
          isGenerating={isGenerating}
          onSubmit={handleSubmit}
          suggestions={[]}
          onSuggestionClick={handleSuggestionClick}
          onTranscriptReceived={onTranscriptReceived}
        />
      </div>
    </Card>
  );
};
