
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ResponseMetadata {
  eventDetected: boolean;
  confidence: number;
  fieldsExtracted: string[];
}

export const useEventAssistant = (selectedModel: 'openai' | 'anthropic') => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I can help you plan campaign events. Tell me what kind of event you want to organize, or just provide a brief description and I can help you flesh out the details.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMetadata, setResponseMetadata] = useState<ResponseMetadata | null>(null);

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
          eventContext: {
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
      
      // Process the response metadata if available
      if (data.metadata) {
        setResponseMetadata({
          eventDetected: data.metadata.eventDetected || false,
          confidence: data.metadata.confidence || 0,
          fieldsExtracted: data.metadata.fieldsExtracted || []
        });
      }
      
      // Add the response to the messages
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error processing your request. Please try again.' }]);
      setResponseMetadata(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([
      { role: 'assistant', content: 'Hi! I can help you plan campaign events. Tell me what kind of event you want to organize, or just provide a brief description and I can help you flesh out the details.' }
    ]);
    setResponseMetadata(null);
  };

  return {
    message,
    setMessage,
    messages,
    setMessages,
    isLoading,
    handleSendMessage,
    responseMetadata,
    clearMessages
  };
};
