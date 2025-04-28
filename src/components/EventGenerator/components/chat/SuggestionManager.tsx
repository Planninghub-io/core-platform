
import React, { useEffect } from 'react';
import { AutocompleteSuggestions } from './AutocompleteSuggestions';
import { generateSuggestions } from './suggestionData';

// Custom hook for managing suggestions
export function useSuggestionManager(
  prompt: string,
  setPrompt: (prompt: string) => void,
  isGenerating: boolean
) {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = React.useState(-1);
  const [dropdownPosition, setDropdownPosition] = React.useState<'above' | 'below'>('below');
  const inputRef = React.useRef<HTMLElement | null>(null);

  // Set reference to the input element
  const setInputElementRef = (ref: HTMLElement | null) => {
    inputRef.current = ref;
  };

  // Determine dropdown position based on input position
  useEffect(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const bottomSpace = viewportHeight - rect.bottom;
      
      // If there's less than 200px of space below the input, show suggestions above
      if (bottomSpace < 200) {
        setDropdownPosition('above');
      } else {
        setDropdownPosition('below');
      }
    }
  }, [showSuggestions]);

  React.useEffect(() => {
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

  const handleKeyNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
            return true;
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
          break;
      }
    }
    return false;
  };

  const showSuggestionsOnFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return {
    suggestions,
    showSuggestions,
    selectedSuggestionIndex,
    handleSuggestionSelect,
    handleKeyNavigation,
    showSuggestionsOnFocus,
    setInputElementRef,
    suggestionsElement: (
      <AutocompleteSuggestions
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        selectedSuggestionIndex={selectedSuggestionIndex}
        onSuggestionSelect={handleSuggestionSelect}
        position={dropdownPosition}
      />
    )
  };
}
