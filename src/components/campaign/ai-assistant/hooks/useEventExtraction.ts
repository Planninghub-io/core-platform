
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GeneratedEvent {
  title: string;
  description: string;
  date?: string;
  location?: string;
  type?: string;
  category?: string;
  expected_attendees?: string;
  end_date?: string;
}

export const useEventExtraction = () => {
  const [generatedEvent, setGeneratedEvent] = useState<GeneratedEvent | null>(null);

  // Simple function to extract event details from conversation
  const extractEventDetails = (messages: Message[]): GeneratedEvent | null => {
    let title = '';
    let description = '';
    let date = '';
    let location = '';
    let type = '';
    let category = '';
    let expected_attendees = '';
    
    const fullText = messages.map(m => m.content).join(' ');
    
    // Basic extraction - in a real application this would be more sophisticated
    const titleMatch = fullText.match(/title:?\s*["']?([^"'\n]+)["']?/i);
    const descMatch = fullText.match(/description:?\s*["']?([^"'\n]+(.+?))["']?(?=\s*location|\s*date|\s*type|$)/is);
    const dateMatch = fullText.match(/date:?\s*["']?([^"'\n]+)["']?/i) || fullText.match(/on:?\s*["']?([^"'\n]+)["']?/i);
    const locationMatch = fullText.match(/location:?\s*["']?([^"'\n]+)["']?/i) || fullText.match(/at:?\s*["']?([^"'\n]+)["']?/i);
    const typeMatch = fullText.match(/type:?\s*["']?([^"'\n]+)["']?/i) || fullText.match(/event type:?\s*["']?([^"'\n]+)["']?/i);
    const categoryMatch = fullText.match(/category:?\s*["']?([^"'\n]+)["']?/i);
    const attendeesMatch = fullText.match(/attendees:?\s*["']?([^"'\n]+)["']?/i) || fullText.match(/expected attendees:?\s*["']?([^"'\n]+)["']?/i);
    
    if (titleMatch) title = titleMatch[1].trim();
    if (descMatch) description = descMatch[1].trim();
    if (dateMatch) date = dateMatch[1].trim();
    if (locationMatch) location = locationMatch[1].trim();
    if (typeMatch) type = typeMatch[1].trim();
    if (categoryMatch) category = categoryMatch[1].trim();
    if (attendeesMatch) expected_attendees = attendeesMatch[1].trim();
    
    // Only return if we have at least a title and one other piece of information
    if (title && (description || date || location || type)) {
      return { title, description, date, location, type, category, expected_attendees };
    }
    
    return null;
  };

  return { generatedEvent, setGeneratedEvent, extractEventDetails };
};
