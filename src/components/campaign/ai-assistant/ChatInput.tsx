
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';
import { VoiceInput } from './VoiceInput';

interface ChatInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

export const ChatInput = ({ message, onMessageChange, onSendMessage, isLoading }: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleTranscriptReceived = (transcript: string) => {
    // Append to existing message or set as new message
    const newMessage = message ? `${message} ${transcript}` : transcript;
    onMessageChange(newMessage);
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Textarea 
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the event you want to create..."
          className="min-h-[60px] resize-none pr-10"
        />
        <div className="absolute right-2 top-2">
          <VoiceInput 
            isLoading={isLoading}
            onTranscriptReceived={handleTranscriptReceived}
          />
        </div>
      </div>
      <Button 
        className="self-end"
        onClick={onSendMessage}
        disabled={isLoading || !message.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};
