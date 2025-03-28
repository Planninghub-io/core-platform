
import React from 'react';
import { AutocompleteSuggestions } from './AutocompleteSuggestions';
import { generateSuggestions } from './suggestionData';

interface SuggestionManagerProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
}

export const SuggestionManager: React.FC<SuggestionManagerProps> = ({
  prompt,
  setPrompt,
  isGenerating
}) => {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = React.useState(-1);

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
    SuggestionsComponent: (
      <AutocompleteSuggestions
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        selectedSuggestionIndex={selectedSuggestionIndex}
        onSuggestionSelect={handleSuggestionSelect}
      />
    )
  };
};
