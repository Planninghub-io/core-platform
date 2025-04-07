
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

  // Log messages for debugging
  console.log(`ChatMessage rendering: ${message.role} message with content: ${message.content?.substring(0, 30)}...`);

  return (
    <div className={`${messageClassName} my-2`}>
      <AIResponseProcessor message={message} isLoading={isLoading} />
    </div>
  );
};
