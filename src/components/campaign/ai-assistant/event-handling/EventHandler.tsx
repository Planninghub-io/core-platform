import React, { useState, useEffect } from 'react';
import { useEventExtraction } from '../hooks/useEventExtraction';

interface EventHandlerProps {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  setActiveTab: (tab: string) => void;
  children: (props: {
    generatedEvent: any;
    setGeneratedEvent: React.Dispatch<React.SetStateAction<any>>;
    isCreating: boolean;
    createEvent: () => void;
    handleBackToChat: () => void;
  }) => React.ReactNode;
}

export const EventHandler = ({
  messages,
  setActiveTab,
  children
}: EventHandlerProps) => {
  const { 
    generatedEvent, 
    setGeneratedEvent, 
    extractEventDetails 
  } = useEventExtraction();
  
  const [isCreating, setIsCreating] = useState(false);
  
  // Process messages for event extraction after each AI response
  useEffect(() => {
    if (!generatedEvent && messages.length >= 2) {
      const eventDetails = extractEventDetails(messages);
      if (eventDetails) {
        setGeneratedEvent(eventDetails);
        setActiveTab('preview');
      }
    }
  }, [messages, generatedEvent, extractEventDetails, setGeneratedEvent, setActiveTab]);
  
  const createEvent = () => {
    if (!generatedEvent) return;
    
    setIsCreating(true);
    
    // Simulate event creation process
    setTimeout(() => {
      // We'll keep the toast and navigation logic in the parent component
      setIsCreating(false);
    }, 1500);
  };
  
  const handleBackToChat = () => {
    setActiveTab('chat');
  };
  
  return (
    <>
      {children({
        generatedEvent,
        setGeneratedEvent,
        isCreating,
        createEvent,
        handleBackToChat
      })}
    </>
  );
};
