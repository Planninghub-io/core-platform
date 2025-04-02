
import React, { useState } from 'react';
import { Dialog } from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useEventAssistant } from './hooks/useEventAssistant';
import { AIAssistantDialogContent } from './dialog-content/AIAssistantDialogContent';
import { EventHandler } from './event-handling/EventHandler';

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
