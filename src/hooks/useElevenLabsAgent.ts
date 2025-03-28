
import { useConversation } from '@11labs/react';
import { useState, useCallback, useEffect } from 'react';

interface UseElevenLabsAgentProps {
  onMessageReceived: (message: string) => void;
  agentId?: string;
}

// Define types for the different message formats
interface AgentMessageWithSource {
  message: string;
  source: string;
}

interface AgentResponseMessage {
  type: string;
  content: string;
}

type AgentMessage = AgentMessageWithSource | AgentResponseMessage;

export function useElevenLabsAgent({ onMessageReceived, agentId = 'B6KmBRX9XAvn2ksmI3DG' }: UseElevenLabsAgentProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create conversation instance
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs agent');
      setIsConnected(true);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs agent');
      setIsConnected(false);
      setConversationActive(false);
    },
    onMessage: (message: any) => {
      // Handle messages from the agent
      if ('message' in message && 'source' in message) {
        // For ElevenLabs agent responses
        if (message.source === 'agent') {
          console.log('Agent response:', message.message);
          onMessageReceived(message.message);
        }
      } else if ('type' in message && message.type === 'agent_response' && 'content' in message) {
        // Alternative message format
        console.log('Agent response:', message.content);
        onMessageReceived(message.content);
      }
    },
    onError: (err: any) => {
      console.error('ElevenLabs agent error:', err);
      setError(`Error: ${err && typeof err === 'object' && 'message' in err ? err.message : 'Unknown error'}`);
      setConversationActive(false);
    }
  });

  // Start the conversation with the agent
  const startConversation = useCallback(async () => {
    try {
      setError(null);
      
      if (!conversationActive) {
        console.log(`Starting conversation with agent ID: ${agentId}`);
        await conversation.startSession({ agentId });
        setConversationActive(true);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Failed to start conversation:', err);
      setError(`Failed to start conversation: ${err.message || 'Unknown error'}`);
      return false;
    }
  }, [conversation, agentId, conversationActive]);

  // End the conversation
  const endConversation = useCallback(async () => {
    if (conversationActive) {
      await conversation.endSession();
      setConversationActive(false);
    }
  }, [conversation, conversationActive]);

  // Adjust volume
  const setVolume = useCallback((volume: number) => {
    conversation.setVolume({ volume: Math.max(0, Math.min(1, volume)) });
  }, [conversation]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (conversationActive) {
        conversation.endSession();
      }
    };
  }, [conversation, conversationActive]);

  return {
    isConnected,
    conversationActive,
    isSpeaking: conversation.isSpeaking,
    error,
    startConversation,
    endConversation,
    setVolume,
    status: conversation.status
  };
}
