
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatTab } from '../ChatTab';
import { EventPreview } from '../EventPreview';

interface TabsContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  suggestedPrompts: string[];
  generatedEvent: any;
  onBackToChat: () => void;
  onCreateEvent: () => void;
  isCreating: boolean;
}

export const TabsContainer = ({
  activeTab,
  setActiveTab,
  messages,
  message,
  setMessage,
  handleSendMessage,
  isLoading,
  suggestedPrompts,
  generatedEvent,
  onBackToChat,
  onCreateEvent,
  isCreating
}: TabsContainerProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="preview" disabled={!generatedEvent}>Event Preview</TabsTrigger>
      </TabsList>
      
      <div className="p-6 pt-2 h-full overflow-hidden flex flex-col">
        <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col mt-0">
          <ChatTab 
            messages={messages}
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            suggestedPrompts={suggestedPrompts}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="flex-1 overflow-y-auto space-y-4 mt-0">
          {generatedEvent && (
            <EventPreview 
              event={generatedEvent}
              onBackToChat={onBackToChat}
              onCreateEvent={onCreateEvent}
              isCreating={isCreating}
            />
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
};
