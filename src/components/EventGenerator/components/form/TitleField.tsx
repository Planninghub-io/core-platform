
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface TitleFieldProps {
  eventTitle: string;
  setEventTitle: (title: string) => void;
  prompt?: string;
}

export const TitleField: React.FC<TitleFieldProps> = ({ 
  eventTitle, 
  setEventTitle,
  prompt = ""
}) => {
  const [isTitleFocused, setIsTitleFocused] = useState(false);

  // Parse event title from prompt on mount or when prompt changes
  useEffect(() => {
    if (prompt && (!eventTitle || eventTitle === 'Enter Event Name')) {
      const parsedTitle = parseEventTitle(prompt);
      if (parsedTitle) {
        setEventTitle(parsedTitle);
      }
    }
  }, [prompt, eventTitle, setEventTitle]);

  // Extract event title from prompt text
  const parseEventTitle = (promptText: string): string | null => {
    // Check for specific event formats first
    const eventPatterns = [
      // Wedding pattern
      /(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:'s)?(?:\s+[A-Za-z]+)?)(?:\s+wedding)/i,
      
      // Birthday pattern
      /(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:'s)?(?:\s+[A-Za-z]+)?)(?:\s+birthday)/i,
      
      // Conference/Meeting pattern
      /(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:\s+[A-Za-z]+){0,2})(?:\s+conference|\s+meeting|\s+workshop)/i,
      
      // Fundraiser pattern
      /(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:\s+[A-Za-z]+){0,2})(?:\s+fundraiser)/i,
      
      // Party/gathering pattern
      /(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:\s+[A-Za-z]+){0,2})(?:\s+party|\s+gathering)/i,
      
      // Named event pattern (e.g., "the Annual Gala")
      /(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:\s+[A-Za-z]+){1,3})\s+(?:event)/i,
      
      // Generic event with name
      /(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:'s)?(?:\s+[A-Za-z]+){0,2})(?:\s+in\s+|(?:\s+at\s+))/i,
    ];
    
    for (const pattern of eventPatterns) {
      const match = promptText.match(pattern);
      if (match && match[1]) {
        let title = match[1].trim();
        
        // Format based on event type
        if (promptText.toLowerCase().includes("wedding")) {
          return `${title}'s Wedding`;
        } else if (promptText.toLowerCase().includes("birthday")) {
          return `${title}'s Birthday`;
        } else if (promptText.toLowerCase().includes("fundraiser")) {
          return `${title} Fundraiser`;
        } else if (promptText.toLowerCase().includes("conference")) {
          return `${title} Conference`;
        } else if (promptText.toLowerCase().includes("workshop")) {
          return `${title} Workshop`;
        } else if (promptText.toLowerCase().includes("party")) {
          return `${title} Party`;
        }
        
        return title;
      }
    }
    
    // Fallback: look for capitalized phrases that might be event names
    const capitalizedPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b/;
    const capitalizedMatch = promptText.match(capitalizedPattern);
    
    if (capitalizedMatch) {
      return capitalizedMatch[1];
    }
    
    return null;
  };

  return (
    <Input
      value={eventTitle}
      onChange={(e) => setEventTitle(e.target.value)}
      onFocus={() => {
        setIsTitleFocused(true);
        if (eventTitle === 'Enter Event Name') {
          setEventTitle('');
        }
      }}
      onBlur={() => {
        setIsTitleFocused(false);
        if (!eventTitle.trim()) {
          setEventTitle('Enter Event Name');
        }
      }}
      placeholder="Enter event title"
      className={`text-xl font-semibold ${
        (eventTitle === 'Enter Event Name' && !isTitleFocused) ? 'text-gray-400 italic' : ''
      }`}
    />
  );
};
