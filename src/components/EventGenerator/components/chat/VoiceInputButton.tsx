
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useElevenLabsAgent } from '@/hooks/useElevenLabsAgent';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VoiceInputButtonProps {
  isGenerating: boolean;
  onTranscriptReceived: (transcript: string) => void;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  isGenerating,
  onTranscriptReceived
}) => {
  const [showMicPermissionToast, setShowMicPermissionToast] = useState(false);

  // Initialize ElevenLabs agent hook
  const {
    conversationActive,
    isSpeaking,
    error,
    startConversation,
    endConversation
  } = useElevenLabsAgent({
    onMessageReceived: (message) => {
      // Process the message from the agent and update the input field
      onTranscriptReceived(message);
    }
  });

  // Show error toast if there's an error with the ElevenLabs agent
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const toggleConversation = async () => {
    if (isGenerating) return;
    
    if (!conversationActive) {
      try {
        // Request microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream after permission check
        
        // Start conversation with ElevenLabs agent
        const success = await startConversation();
        if (!success) {
          toast.error("Could not connect to voice assistant");
        }
      } catch (err) {
        console.error("Microphone permission error:", err);
        setShowMicPermissionToast(true);
        toast.error("Microphone access is required for voice assistant");
      }
    } else {
      await endConversation();
    }
  };

  return (
    <button
      type="button"
      onClick={toggleConversation}
      disabled={isGenerating}
      className={`text-gray-400 hover:text-gray-600 transition-colors ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={conversationActive ? "Stop voice assistant" : "Start voice assistant"}
    >
      {conversationActive ? (
        isSpeaking ? 
          <Volume2 size={18} className="text-green-500 animate-pulse" /> :
          <MicOff size={18} className="text-red-500" />
      ) : (
        <Mic size={18} />
      )}
    </button>
  );
};
