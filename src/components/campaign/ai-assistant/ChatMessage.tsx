
import React from 'react';
import { AIResponseProcessor } from './AIResponseProcessor';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export const ChatMessage = ({ message, isLoading = false }: ChatMessageProps) => {
  return <AIResponseProcessor message={message} isLoading={isLoading} />;
};
