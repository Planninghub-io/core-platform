import React, { useState } from 'react';
import { Dialog } from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useEventAssistant } from './ai-assistant/hooks/useEventAssistant';
import { AIAssistantDialogContent } from './ai-assistant/dialog-content/AIAssistantDialogContent';
import { EventHandler } from './ai-assistant/event-handling/EventHandler';
import { Card, CardContent } from "@/components/ui/card";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CampaignAIAssistantProps {
  onClose: () => void;
  displayInline?: boolean;
}

export const CampaignAIAssistant = ({ onClose, displayInline = false }: CampaignAIAssistantProps) => {
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

  const suggestedPrompts = [
    "Help me create a town hall event for my campaign",
    "I need to organize a fundraising dinner next month",
    "Plan a volunteer training session for my campaign staff",
    "Create a virtual phone banking event"
  ];

  const handleEventCreated = () => {
    toast.success('Event created successfully!', {
      description: `Your event has been added to your events.`,
      action: {
        label: 'View',
        onClick: () => navigate('/events-hub')
      }
    });
    onClose();
  };

  // Render the assistant inline instead of in a dialog if requested
  if (displayInline) {
    return (
      <Card className="mt-6 mb-8 shadow-lg">
        <CardContent className="p-0 relative">
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-2 right-2 z-10" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <EventHandler messages={messages} setActiveTab={setActiveTab}>
            {({ generatedEvent, setGeneratedEvent, isCreating, createEvent, handleBackToChat }) => (
              <div className="h-[550px] relative">
                <div className="p-4 pb-0">
                  <AIModelSelector 
                    selectedModel={selectedModel} 
                    onModelChange={setSelectedModel} 
                  />
                </div>
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
                  onBackToChat={handleBackToChat}
                  onCreateEvent={createEvent}
                  isCreating={isCreating}
                />
              </div>
            )}
          </EventHandler>
        </CardContent>
      </Card>
    );
  }

  // Original dialog implementation for non-inline display
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <EventHandler messages={messages} setActiveTab={setActiveTab}>
        {({ generatedEvent, setGeneratedEvent, isCreating, createEvent, handleBackToChat }) => (
          <AIAssistantDialogContent
            onClose={onClose}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            messages={messages}
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            suggestedPrompts={suggestedPrompts}
            generatedEvent={generatedEvent}
            onCreateEvent={() => {
              createEvent();
              handleEventCreated();
            }}
            isCreating={isCreating}
            onBackToChat={handleBackToChat}
          />
        )}
      </EventHandler>
    </Dialog>
  );
};

// Import the required components for the inline version
import { AIModelSelector } from './ai-assistant/AIModelSelector';
import { TabsContainer } from './ai-assistant/tabs/TabsContainer';
