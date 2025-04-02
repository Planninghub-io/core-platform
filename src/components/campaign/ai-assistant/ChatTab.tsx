
import React from 'react';
import { MessagesList } from './MessagesList';
import { SuggestedPrompts } from './SuggestedPrompts';
import { ChatInput } from './ChatInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatTabProps {
  messages: Message[];
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  suggestedPrompts: string[];
}

export const ChatTab = ({ 
  messages, 
  message, 
  setMessage, 
  handleSendMessage, 
  isLoading,
  suggestedPrompts 
}: ChatTabProps) => {
  const handlePromptSelect = (prompt: string) => {
    setMessage(prompt);
    setTimeout(handleSendMessage, 100);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col mt-0">
      <MessagesList messages={messages} isLoading={isLoading} />
      
      {messages.length === 1 && (
        <SuggestedPrompts 
          prompts={suggestedPrompts} 
          onPromptSelect={handlePromptSelect} 
        />
      )}
      
      <ChatInput 
        message={message} 
        onMessageChange={setMessage} 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
      />
    </div>
  );
};
