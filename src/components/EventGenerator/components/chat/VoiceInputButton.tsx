
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useElevenLabsAgent } from '@/hooks/useElevenLabsAgent';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VoiceInputButtonProps {
  isGenerating: boolean;
  onTranscriptReceived: (transcript: string) => void;
  className?: string;
  showLabel?: boolean;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  isGenerating,
  onTranscriptReceived,
  className = '',
  showLabel = false
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
        } else {
          toast.success("AI Planner Agent activated");
        }
      } catch (err) {
        console.error("Microphone permission error:", err);
        setShowMicPermissionToast(true);
        toast.error("Microphone access is required for voice assistant");
      }
    } else {
      await endConversation();
      toast.info("AI Planner Agent deactivated");
    }
  };

  const buttonColorClass = conversationActive
    ? isSpeaking 
      ? "bg-green-500 hover:bg-green-600" 
      : "bg-red-500 hover:bg-red-600"
    : "bg-purple-500 hover:bg-purple-600";

  return (
    <div className={`inline-flex ${className}`}>
      {showLabel && (
        <Button
          onClick={toggleConversation}
          disabled={isGenerating}
          className={`${buttonColorClass} text-white transition-colors rounded-full gap-2`}
          aria-label={conversationActive ? "Stop AI Planner" : "AI Planner"}
        >
          {conversationActive ? (
            isSpeaking ? (
              <>
                <Volume2 size={18} className="animate-pulse" />
                {showLabel && <span>AI is Speaking...</span>}
              </>
            ) : (
              <>
                <MicOff size={18} />
                {showLabel && <span>Stop AI Planner</span>}
              </>
            )
          ) : (
            <>
              <Mic size={18} />
              {showLabel && <span>AI Planner</span>}
            </>
          )}
        </Button>
      )}
      {!showLabel && (
        <button
          type="button"
          onClick={toggleConversation}
          disabled={isGenerating}
          className={`${isGenerating ? 'opacity-50 cursor-not-allowed' : ''} text-gray-400 hover:text-gray-600 transition-colors`}
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
      )}
    </div>
  );
};
