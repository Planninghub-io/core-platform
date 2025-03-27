
import React, { useRef, useEffect, useState } from "react";

interface AutocompleteSuggestionsProps {
  suggestions: string[];
  showSuggestions: boolean;
  selectedSuggestionIndex: number;
  onSuggestionSelect: (suggestion: string) => void;
}

export const AutocompleteSuggestions: React.FC<AutocompleteSuggestionsProps> = ({
  suggestions,
  showSuggestions,
  selectedSuggestionIndex,
  onSuggestionSelect,
}) => {
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(showSuggestions);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update visibility when props change
  useEffect(() => {
    setIsVisible(showSuggestions);
  }, [showSuggestions]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
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
            onClick={() => onSuggestionSelect(suggestion)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};
