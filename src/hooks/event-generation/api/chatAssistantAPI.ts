import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatAssistantRequest {
  messages: ChatMessage[];
  modelProvider?: 'openai' | 'anthropic';
  context?: {
    hasDate?: boolean;
    hasLocation?: boolean;
    hasEventType?: boolean;
    collectedInfo?: Record<string, any>;
  };
}

interface ChatAssistantResponse {
  message: string;
  suggestions?: string[];
}

export const chatAssistantAPI = async ({
  messages,
  modelProvider = 'openai',
  context = {}
}: ChatAssistantRequest): Promise<ChatAssistantResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('chat-assistant', {
      body: {
        messages,
        modelProvider,
        context,
      },
    });

    if (error) {
      console.error('chatAssistantAPI: Edge function error:', error);
      throw error;
    }

    return {
      message: data.message || 'I apologize, but I had trouble processing that.',
      suggestions: data.suggestions || [],
    };
  } catch (error) {
    console.error('chatAssistantAPI: Error:', error);
    return {
      message: 'I apologize, but I encountered an error. Could you try again?',
      suggestions: [],
    };
  }
};

