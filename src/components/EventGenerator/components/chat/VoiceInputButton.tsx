
import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface VoiceInputButtonProps {
  isGenerating: boolean;
  onTranscriptReceived: (transcript: string) => void;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  isGenerating,
  onTranscriptReceived
}) => {
  const { isListening, toggleListening } = useSpeechRecognition({
    onResultCallback: onTranscriptReceived
  });

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={isGenerating}
      className={`text-gray-400 hover:text-gray-600 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isListening ? "Stop recording" : "Start voice input"}
    >
      {isListening ? <MicOff size={18} className="text-red-500" /> : <Mic size={18} />}
    </button>
  );
};
