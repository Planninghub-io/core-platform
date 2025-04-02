
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
  // Add additional styling based on message role
  const messageClassName = message.role === 'user' 
    ? 'ml-auto max-w-[85%]' 
    : 'mr-auto max-w-[85%]';

  return (
    <div className={`${messageClassName}`}>
      <AIResponseProcessor message={message} isLoading={isLoading} />
    </div>
  );
};
