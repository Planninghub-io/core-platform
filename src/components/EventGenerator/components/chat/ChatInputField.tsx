
import { Input } from "@/components/ui/input";
import React, { FormEvent, forwardRef, useState, useEffect, useRef } from "react";
import { RotateCcw, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutocompleteSuggestions } from "./AutocompleteSuggestions";
import { generateSuggestions } from "./suggestionData";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatInputFieldProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onSubmit: (e?: FormEvent) => void;
  shouldShowButton?: boolean;
  className?: string;
  generatedEvent?: any;
  chatMessages?: Array<{ type: 'user' | 'ai', content: string }>;
  handlePromptSubmit?: (prompt: string) => void;
}

export const ChatInputField = forwardRef<HTMLInputElement, ChatInputFieldProps>(
  ({ 
    prompt, 
    setPrompt, 
    isGenerating, 
    onSubmit, 
    shouldShowButton = false,
    className = '',
    generatedEvent,
    chatMessages,
    handlePromptSubmit 
  }, ref) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [isListening, setIsListening] = useState(false);
    const isMobile = useIsMobile();
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
      if (isGenerating) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const newSuggestions = generateSuggestions(prompt);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    }, [prompt, isGenerating]);

    const handleSuggestionSelect = (suggestion: string) => {
      const words = prompt.split(' ');
      const lastWord = words[words.length - 1].toLowerCase();
      
      if (suggestion.toLowerCase().startsWith(lastWord) && lastWord.length > 0) {
        const newPrompt = prompt.substring(0, prompt.lastIndexOf(lastWord)) + suggestion;
        setPrompt(newPrompt);
      } else {
        setPrompt(prompt ? `${prompt} ${suggestion}` : suggestion);
      }
      
      setSuggestions([]);
      setShowSuggestions(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (showSuggestions && suggestions.length > 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedSuggestionIndex(prev => 
              prev < suggestions.length - 1 ? prev + 1 : 0
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setSelectedSuggestionIndex(prev => 
              prev > 0 ? prev - 1 : suggestions.length - 1
            );
            break;
          case "Tab":
          case "Enter":
            if (selectedSuggestionIndex >= 0) {
              e.preventDefault();
              handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
              return;
            }
            break;
          case "Escape":
            setShowSuggestions(false);
            setSelectedSuggestionIndex(-1);
            break;
        }
      }
      
      if (e.key === "Enter" && !e.shiftKey && prompt.trim() && !isGenerating && !showSuggestions) {
        e.preventDefault();
        onSubmit();
      }
    };

    const clearInput = () => {
      setPrompt("");
      if (ref && 'current' in ref && ref.current) {
        ref.current.focus();
      }
    };

    const toggleListening = () => {
      if (isGenerating) return;

      if (!isListening) {
        startListening();
      } else {
        stopListening();
      }
    };

    const startListening = () => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.error('Speech recognition not supported in this browser');
        return;
      }

      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          console.log('Voice recognition started');
          setIsListening(true);
        };

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          
          setPrompt(transcript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          stopListening();
        };

        recognitionRef.current.onend = () => {
          console.log('Voice recognition ended');
          setIsListening(false);
        };

        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    };

    const stopListening = () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    };

    // Cleanup speech recognition on unmount
    useEffect(() => {
      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    }, []);

    return (
      <div className={`relative flex-1 ${className}`}>
        <Input
          ref={ref}
          type="text"
          placeholder={isMobile ? "Ask about an event..." : "Ask about planning an event..."}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-full pr-20 h-11" // Extended right padding for both icons
          disabled={isGenerating}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        />
        
        <AutocompleteSuggestions
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          selectedSuggestionIndex={selectedSuggestionIndex}
          onSuggestionSelect={handleSuggestionSelect}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {/* Microphone button */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={isGenerating}
            className={`text-gray-400 hover:text-gray-600 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={isListening ? "Stop recording" : "Start voice input"}
          >
            {isListening ? <MicOff size={18} className="text-red-500" /> : <Mic size={18} />}
          </button>
          
          {/* Clear button - only show when there's text */}
          {prompt && !isGenerating && (
            <button
              type="button"
              onClick={clearInput}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Clear input"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>

        {shouldShowButton && (
          <Button
            type="submit"
            size="icon"
            disabled={isGenerating || !prompt.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-[#242424] hover:bg-[#242424]/90"
            onClick={() => onSubmit()}
            aria-label="Send"
          >
            <span className="sr-only">Send</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-white"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </Button>
        )}
      </div>
    );
  }
);

// Add TypeScript declarations for the Web Speech API since they're not included in the standard lib
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

ChatInputField.displayName = "ChatInputField";
