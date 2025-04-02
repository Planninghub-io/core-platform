
import React from 'react';
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { AIModelSelector } from '../AIModelSelector';
import { DialogHeaderContent } from '../DialogHeaderContent';
import { TabsContainer } from '../tabs/TabsContainer';

interface AIAssistantDialogContentProps {
  onClose: () => void;
  selectedModel: 'openai' | 'anthropic';
  onModelChange: (model: 'openai' | 'anthropic') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  suggestedPrompts: string[];
  generatedEvent: any;
  onCreateEvent: () => void;
  isCreating: boolean;
  onBackToChat: () => void;
}

export const AIAssistantDialogContent = ({
  onClose,
  selectedModel,
  onModelChange,
  activeTab,
  setActiveTab,
  messages,
  message,
  setMessage,
  handleSendMessage,
  isLoading,
  suggestedPrompts,
  generatedEvent,
  onCreateEvent,
  isCreating,
  onBackToChat
}: AIAssistantDialogContentProps) => {
  return (
    <DialogContent className="sm:max-w-[900px] sm:h-[650px] p-0">
      <DialogHeader className="p-6 pb-2">
        <DialogHeaderContent onClose={onClose} />
      </DialogHeader>
      
      <div className="flex items-center gap-2 px-6 pb-2">
        <AIModelSelector 
          selectedModel={selectedModel} 
          onModelChange={onModelChange} 
        />
        
        <TabsContainer 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          messages={messages}
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          suggestedPrompts={suggestedPrompts}
          generatedEvent={generatedEvent}
          onBackToChat={onBackToChat}
          onCreateEvent={onCreateEvent}
          isCreating={isCreating}
        />
      </div>
    </DialogContent>
  );
};
