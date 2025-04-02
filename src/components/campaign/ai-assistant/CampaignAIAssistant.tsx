
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { AIModelSelector } from './AIModelSelector';
import { ChatTab } from './ChatTab';
import { EventPreview } from './EventPreview';
import { DialogHeaderContent } from './DialogHeaderContent';
import { useEventAssistant } from './hooks/useEventAssistant';
import { useEventExtraction } from './hooks/useEventExtraction';

interface CampaignAIAssistantProps {
  onClose: () => void;
}

export const CampaignAIAssistant = ({ onClose }: CampaignAIAssistantProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedModel, setSelectedModel] = useState<'openai' | 'anthropic'>('openai');
  
  const { 
    message, 
    setMessage, 
    messages, 
    isLoading, 
    handleSendMessage 
  } = useEventAssistant(selectedModel);
  
  const { 
    generatedEvent, 
    setGeneratedEvent, 
    extractEventDetails 
  } = useEventExtraction();

  // Process messages for event extraction after each AI response
  React.useEffect(() => {
    if (!generatedEvent && messages.length >= 2) {
      const eventDetails = extractEventDetails(messages);
      if (eventDetails) {
        setGeneratedEvent(eventDetails);
        setActiveTab('preview');
      }
    }
  }, [messages, generatedEvent, extractEventDetails, setGeneratedEvent]);

  const [isCreating, setIsCreating] = useState(false);
  
  const createEvent = () => {
    if (!generatedEvent) return;
    
    setIsCreating(true);
    
    // Simulate event creation process
    setTimeout(() => {
      toast.success('Event created successfully!', {
        description: `"${generatedEvent.title}" has been added to your events.`,
        action: {
          label: 'View',
          onClick: () => navigate('/events-hub')
        }
      });
      setIsCreating(false);
      onClose();
    }, 1500);
  };

  const suggestedPrompts = [
    "Help me create a town hall event for my campaign",
    "I need to organize a fundraising dinner next month",
    "Plan a volunteer training session for my campaign staff",
    "Create a virtual phone banking event"
  ];

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] sm:h-[650px] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogHeaderContent onClose={onClose} />
        </DialogHeader>
        
        <div className="flex items-center gap-2 px-6 pb-2">
          <AIModelSelector 
            selectedModel={selectedModel} 
            onModelChange={setSelectedModel} 
          />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="preview" disabled={!generatedEvent}>Event Preview</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
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
                onBackToChat={() => setActiveTab('chat')}
                onCreateEvent={createEvent}
                isCreating={isCreating}
              />
            )}
          </TabsContent>
        </div>
      </DialogContent>
    </Dialog>
  );
};
