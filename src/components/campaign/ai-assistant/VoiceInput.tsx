
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VoiceInputProps {
  isLoading: boolean;
  onTranscriptReceived: (transcript: string) => void;
  className?: string;
}

export const VoiceInput = ({ isLoading, onTranscriptReceived, className = '' }: VoiceInputProps) => {
  const [showMicPermissionToast, setShowMicPermissionToast] = useState(false);

  const { isListening, toggleListening } = useSpeechRecognition({
    onResultCallback: (transcript) => {
      if (transcript.trim()) {
        onTranscriptReceived(transcript);
      }
    },
    onErrorCallback: (error) => {
      console.error('Speech recognition error:', error);
      toast.error('Could not understand speech. Please try again.');
    }
  });

  const handleToggleListening = async () => {
    if (isLoading) return;

    try {
      // Request microphone permission before starting
      if (!isListening) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream after permission check
      }
      toggleListening();
    } catch (err) {
      console.error("Microphone permission error:", err);
      setShowMicPermissionToast(true);
      toast.error("Please allow microphone access to use voice input");
    }
  };

  return (
    <Button
      type="button"
      onClick={handleToggleListening}
      disabled={isLoading}
      variant="ghost"
      size="icon"
      className={`${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className} ${
        isListening ? 'text-red-500 hover:bg-red-100' : 'text-gray-500 hover:bg-gray-100'
      } transition-colors`}
      aria-label={isListening ? "Stop voice input" : "Start voice input"}
      title={isListening ? "Stop voice input" : "Start voice input"}
    >
      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
    </Button>
  );
};
