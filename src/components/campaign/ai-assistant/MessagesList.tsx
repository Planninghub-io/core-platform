
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MessagesListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessagesList = ({ messages, isLoading }: MessagesListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-4">
      {messages.map((msg, index) => (
        <ChatMessage 
          key={index} 
          message={msg} 
          isLoading={isLoading && index === messages.length - 1 && msg.role === 'assistant'} 
        />
      ))}
      
      {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
        <ChatMessage 
          message={{ role: 'assistant', content: '' }}
          isLoading={true}
        />
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
