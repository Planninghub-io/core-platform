
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
          toast.success("AI Planner activated");
        }
      } catch (err) {
        console.error("Microphone permission error:", err);
        setShowMicPermissionToast(true);
        toast.error("Microphone access is required for voice assistant");
      }
    } else {
      await endConversation();
      toast.info("AI Planner deactivated");
    }
  };

  // For icon-only mode, return just the button with the appropriate icon
  if (!showLabel) {
    return (
      <button
        type="button"
        onClick={toggleConversation}
        disabled={isGenerating}
        className={`${isGenerating ? 'opacity-50 cursor-not-allowed' : ''} p-2 rounded-full ${className} ${
          conversationActive 
            ? isSpeaking 
              ? "text-green-500 hover:bg-green-100" 
              : "text-red-500 hover:bg-red-100"
            : "text-purple-500 hover:bg-purple-100"
        } transition-colors`}
        aria-label={conversationActive ? "Stop AI Planner" : "AI Planner"}
        title={conversationActive ? "Stop AI Planner" : "AI Planner"}
      >
        {conversationActive ? (
          isSpeaking ? 
            <Volume2 size={20} className="animate-pulse" /> :
            <MicOff size={20} />
        ) : (
          <Mic size={20} />
        )}
      </button>
    );
  }

  // For button with label
  const buttonColorClass = conversationActive
    ? isSpeaking 
      ? "bg-green-500 hover:bg-green-600" 
      : "bg-red-500 hover:bg-red-600"
    : "bg-purple-500 hover:bg-purple-600";

  return (
    <Button
      onClick={toggleConversation}
      disabled={isGenerating}
      className={`${buttonColorClass} text-white transition-colors rounded-full gap-2 ${className}`}
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
  );
};
