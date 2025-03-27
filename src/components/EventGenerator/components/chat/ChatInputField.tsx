
import { Input } from "@/components/ui/input";
import React, { FormEvent, forwardRef, useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputFieldProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onSubmit: (e?: FormEvent) => void;
  shouldShowButton?: boolean;
  // Add the missing props that are being passed from ChatInput
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
    // Adding the new props with default values
    generatedEvent,
    chatMessages,
    handlePromptSubmit 
  }, ref) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState(-1);

    // Event types for suggestions
    const eventTypes = [
      "birthday party", "wedding", "corporate meeting", "conference", 
      "team building", "fundraiser", "workshop", "seminar", 
      "product launch", "networking event", "retreat", "gala dinner"
    ];

    // Locations for suggestions
    const locations = [
      "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", 
      "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Francisco"
    ];

    useEffect(() => {
      if (prompt.length > 2) {
        // Generate suggestions based on what the user is typing
        const words = prompt.toLowerCase().split(' ');
        const lastWord = words[words.length - 1];
        
        let newSuggestions: string[] = [];
        
        // Suggest event types
        if (words.includes('plan') || words.includes('organize') || words.includes('create')) {
          newSuggestions = eventTypes
            .filter(type => type.toLowerCase().includes(lastWord))
            .slice(0, 3);
        }
        
        // Suggest locations
        if (words.includes('in') || words.includes('at') || words.includes('location')) {
          newSuggestions = [
            ...newSuggestions,
            ...locations
              .filter(location => location.toLowerCase().includes(lastWord))
              .slice(0, 3)
          ];
        }
        
        // Suggest dates
        if (words.includes('on') || words.includes('date')) {
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          const twoMonthsLater = new Date();
          twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);
          
          newSuggestions = [
            ...newSuggestions,
            `next weekend`,
            `${nextMonth.toLocaleString('default', { month: 'long' })} ${Math.floor(Math.random() * 28) + 1}`,
            `${twoMonthsLater.toLocaleString('default', { month: 'long' })} ${Math.floor(Math.random() * 28) + 1}`
          ];
        }
        
        setSuggestions(newSuggestions.slice(0, 3));
        setShowSuggestions(newSuggestions.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, [prompt]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey && prompt.trim() && !isGenerating) {
        e.preventDefault();
        setShowSuggestions(false);
        onSubmit();
      } else if (e.key === "Tab" && showSuggestions && suggestions.length > 0) {
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          applySuggestion(suggestions[selectedSuggestion]);
        } else {
          applySuggestion(suggestions[0]);
        }
      } else if (e.key === "ArrowDown" && showSuggestions) {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp" && showSuggestions) {
        e.preventDefault();
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : 0);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    };

    const applySuggestion = (suggestion: string) => {
      const words = prompt.split(' ');
      words[words.length - 1] = suggestion;
      setPrompt(words.join(' ') + ' ');
      setShowSuggestions(false);
    };

    const clearInput = () => {
      setPrompt("");
      if (ref && 'current' in ref && ref.current) {
        ref.current.focus();
      }
    };

    return (
      <div className="relative flex-1">
        <Input
          ref={ref}
          type="text"
          placeholder="Ask about planning an event..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-10 py-6 rounded-full"
          disabled={isGenerating}
        />
        {prompt && !isGenerating && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <RotateCcw size={16} />
          </button>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200">
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    index === selectedSuggestion ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => applySuggestion(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
            <div className="px-3 py-1 text-xs text-gray-500 border-t">
              Press Tab to autocomplete
            </div>
          </div>
        )}

        {shouldShowButton && (
          <Button
            type="submit"
            size="icon"
            disabled={isGenerating || !prompt.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-[#242424] hover:bg-[#242424]/90"
            onClick={() => onSubmit()}
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

ChatInputField.displayName = "ChatInputField";
