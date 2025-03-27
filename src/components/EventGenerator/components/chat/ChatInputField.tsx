import { Input } from "@/components/ui/input";
import React, { FormEvent, forwardRef, useState, useEffect, useRef } from "react";
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

// Suggestion data for autocomplete
const EVENT_TYPE_SUGGESTIONS = [
  "birthday party", "wedding", "corporate event", "conference", 
  "team building", "retreat", "dinner party", "fundraiser",
  "concert", "workshop", "seminar", "meeting", "exhibition"
];

const LOCATION_SUGGESTIONS = [
  "New York", "Los Angeles", "Chicago", "San Francisco", "Miami",
  "Seattle", "Austin", "Boston", "Denver", "Atlanta", "Dallas",
  "San Diego", "Portland", "Nashville", "Las Vegas", "Houston"
];

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
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Handle suggestion selection
    const handleSuggestionSelect = (suggestion: string) => {
      // Check if we need to replace a word or just append
      const words = prompt.split(' ');
      const lastWord = words[words.length - 1].toLowerCase();
      
      // If the last word appears to be the start of the suggestion, replace it
      if (suggestion.toLowerCase().startsWith(lastWord) && lastWord.length > 0) {
        const newPrompt = prompt.substring(0, prompt.lastIndexOf(lastWord)) + suggestion;
        setPrompt(newPrompt);
      } else {
        // Otherwise just append with a space
        setPrompt(prompt ? `${prompt} ${suggestion}` : suggestion);
      }
      
      setSuggestions([]);
      setShowSuggestions(false);
    };

    // Generate suggestions based on input
    useEffect(() => {
      if (prompt.trim() === '' || isGenerating) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const words = prompt.toLowerCase().split(' ');
      const lastWord = words[words.length - 1];
      
      if (lastWord.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      // Check for potential event type
      const eventTypeSuggestions = EVENT_TYPE_SUGGESTIONS.filter(type => 
        type.toLowerCase().includes(lastWord)
      );

      // Check for potential location
      const locationSuggestions = LOCATION_SUGGESTIONS.filter(location => 
        location.toLowerCase().includes(lastWord)
      );

      // Combine suggestions
      const combinedSuggestions = [...eventTypeSuggestions, ...locationSuggestions];
      
      // Add date suggestions if text might be related to dates
      if (lastWord.includes('on') || lastWord.includes('at') || 
          prompt.toLowerCase().includes('date') || prompt.toLowerCase().includes('when')) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        // Add some common date formats
        combinedSuggestions.push(
          today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
          tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
          "next weekend",
          "next month",
          "this Friday",
          "this Saturday"
        );
      }

      // Limit suggestions to top 5 for better UX
      const filteredSuggestions = [...new Set(combinedSuggestions)].slice(0, 5);
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    }, [prompt, isGenerating]);

    // Close suggestions when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Handle navigation and selection of suggestions
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
      
      // Original enter key behavior for submitting the prompt
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
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        />
        
        {/* Autocomplete suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef} 
            className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border border-gray-200 max-h-60 overflow-y-auto"
          >
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={`suggestion-${index}`}
                  className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 ${
                    index === selectedSuggestionIndex ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {prompt && !isGenerating && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <RotateCcw size={16} />
          </button>
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
