import { Input } from "@/components/ui/input";
import React, { FormEvent, forwardRef, useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutocompleteSuggestions } from "./AutocompleteSuggestions";
import { generateSuggestions } from "./suggestionData";

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

    return (
      <div className={`relative flex-1 ${className}`}>
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
        
        <AutocompleteSuggestions
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          selectedSuggestionIndex={selectedSuggestionIndex}
          onSuggestionSelect={handleSuggestionSelect}
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
