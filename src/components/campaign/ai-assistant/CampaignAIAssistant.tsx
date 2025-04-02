
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { AIModelSelector } from './ai-assistant/AIModelSelector';
import { ChatTab } from './ai-assistant/ChatTab';
import { EventPreview } from './ai-assistant/EventPreview';
import { useEventExtraction } from './ai-assistant/hooks/useEventExtraction';

interface CampaignAIAssistantProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const CampaignAIAssistant = ({ onClose }: CampaignAIAssistantProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I can help you plan campaign events. Tell me what kind of event you want to organize, or just provide a brief description and I can help you flesh out the details.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'openai' | 'anthropic'>('openai');
  const [isCreating, setIsCreating] = useState(false);
  
  const { generatedEvent, setGeneratedEvent, extractEventDetails } = useEventExtraction();

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage = message;
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    try {
      // Call the AI assistant edge function
      const { data, error } = await supabase.functions.invoke('event-ai-assistant', {
        body: { 
          question: userMessage,
          eventContext: generatedEvent || {
            title: '',
            date: '',
            end_date: '',
            description: '',
            location: '',
            category: '',
            expected_attendees: ''
          },
          modelProvider: selectedModel
        }
      });
      
      if (error) throw error;
      
      // Add the response to the messages
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      
      // Try to extract event details from the conversation
      if (!generatedEvent) {
        const eventDetails = extractEventDetails([...messages, { role: 'user', content: userMessage }, { role: 'assistant', content: data.response }]);
        if (eventDetails) {
          setGeneratedEvent(eventDetails);
          setActiveTab('preview');
        }
      }
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error processing your request. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">Campaign AI Assistant</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Create campaign events with AI assistance from OpenAI or Claude
          </DialogDescription>
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
