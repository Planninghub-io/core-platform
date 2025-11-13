import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface FunctionCall {
  name: string;
  args: any;
}

interface PlannerAIResponse {
  response: string;
  functionCalls?: FunctionCall[];
}

interface EventContext {
  title?: string;
  date?: string;
  end_date?: string;
  description?: string;
  location?: string;
  category?: string;
  expected_attendees?: string | number;
}

export const usePlannerAI = (eventContext?: EventContext) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hi! I\'m Planner AI, your intelligent event planning assistant. I can help you:\n\n• Find and recommend venues\n• Generate event ideas and details\n• Create planning checklists\n• Provide creative suggestions\n\nWhat would you like to plan today?' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [functionCalls, setFunctionCalls] = useState<FunctionCall[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // Add user message to conversation
    const userMsg: Message = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      // Prepare messages for the API (excluding system message)
      const conversationMessages = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({ role: msg.role, content: msg.content }));

      // Add the new user message
      conversationMessages.push({ role: 'user', content: userMessage });

      // Call the planner-ai edge function
      const { data, error: invokeError } = await supabase.functions.invoke('planner-ai', {
        body: {
          messages: conversationMessages,
          eventContext: eventContext || {}
        }
      });

      if (invokeError) {
        throw invokeError;
      }

      if (!data || !data.response) {
        throw new Error('No response from Planner AI');
      }

      // Store function calls if any
      if (data.functionCalls && data.functionCalls.length > 0) {
        setFunctionCalls(prev => [...prev, ...data.functionCalls]);
      }

      // Add assistant response to messages
      const assistantMsg: Message = { 
        role: 'assistant', 
        content: data.response 
      };
      setMessages(prev => [...prev, assistantMsg]);

    } catch (err: any) {
      console.error('Error calling Planner AI:', err);
      const errorMessage = err.message || 'Sorry, I encountered an error processing your request. Please try again.';
      setError(errorMessage);
      
      const errorMsg: Message = { 
        role: 'assistant', 
        content: errorMessage 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, eventContext]);

  const clearConversation = useCallback(() => {
    setMessages([
      { 
        role: 'assistant', 
        content: 'Hi! I\'m Planner AI, your intelligent event planning assistant. I can help you:\n\n• Find and recommend venues\n• Generate event ideas and details\n• Create planning checklists\n• Provide creative suggestions\n\nWhat would you like to plan today?' 
      }
    ]);
    setFunctionCalls([]);
    setError(null);
  }, []);

  const updateEventContext = useCallback((newContext: EventContext) => {
    // This allows updating the event context for future messages
    // Note: This doesn't update the current eventContext prop, 
    // but you can pass a new eventContext when creating the hook
  }, []);

  return {
    messages,
    isLoading,
    error,
    functionCalls,
    sendMessage,
    clearConversation,
    updateEventContext
  };
};



