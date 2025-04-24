
import { GenerateEventResponse } from "../../types/api-types";

/**
 * API service for generating events with AI
 */
export const generateEventAPI = async ({ 
  prompt, 
  additionalInfo = {},
  modelProvider = 'openai'
}: {
  prompt: string;
  additionalInfo?: Record<string, any>;
  modelProvider?: 'openai' | 'anthropic';
}): Promise<GenerateEventResponse> => {
  try {
    console.log(`generateEventAPI: Generating event with model: ${modelProvider}`);
    console.log(`generateEventAPI: Prompt content: ${prompt}`);
    console.log(`generateEventAPI: Additional info:`, additionalInfo);
    
    // Extract location and date from the prompt to make it match user input
    const locationMatch = prompt.match(/in\s+([^,\.]+?)(?:\s+on|$)/i);
    const dateMatch = prompt.match(/on\s+([^,\.]+?)$/i);
    
    // Parse guest count if present
    const guestMatch = prompt.match(/(\d+)\s+guests?/i);
    const guestCount = guestMatch ? guestMatch[1] : "100";
    
    // Very simple event generation for demo purposes
    // This would normally call an AI service
    const eventData = {
      title: getEventTitle(prompt),
      description: `Celebrate a special day at this beautiful wedding event with capacity for ${guestCount} guests.`,
      date: dateMatch ? convertToISODate(dateMatch[1]) : "2025-05-25T15:00:00.000Z",
      location: locationMatch ? locationMatch[1] : "Las Vegas",
      category: "Wedding",
      estimatedPrice: additionalInfo.budget || "$5,000"
    };
    
    console.log(`generateEventAPI: Generated event data:`, eventData);
    
    // Mock API response
    return {
      data: eventData,
      missing: []
    };
  } catch (error) {
    console.error(`generateEventAPI: Error:`, error);
    return { error: error instanceof Error ? error : new Error('Unknown error in event generation') } as any;
  }
};

/**
 * Extract a potential event title from the prompt
 */
function getEventTitle(prompt: string): string {
  const weddingMatch = prompt.match(/wedding(?:\s+for\s+([^,\.]+))?/i);
  const birthdayMatch = prompt.match(/birthday(?:\s+for\s+([^,\.]+))?/i);
  
  if (weddingMatch && weddingMatch[1]) {
    return `${weddingMatch[1]}'s Wedding`;
  } else if (birthdayMatch && birthdayMatch[1]) {
    return `${birthdayMatch[1]}'s Birthday`;
  } else if (prompt.toLowerCase().includes('wedding')) {
    return "Wedding Celebration";
  }
  
  return "New Event";
}

/**
 * Convert a date string to ISO format
 */
function convertToISODate(dateStr: string): string {
  try {
    // Handle formats like "May 25th"
    const monthMatch = dateStr.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d+)(st|nd|rd|th)?/i);
    
    if (monthMatch) {
      const month = monthMatch[1];
      const day = parseInt(monthMatch[2]);
      const currentYear = new Date().getFullYear();
      
      // Map month name to month number (0-11)
      const months: Record<string, number> = {
        january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
        july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
      };
      
      const monthNumber = months[month.toLowerCase()];
      if (monthNumber !== undefined) {
        const date = new Date(currentYear, monthNumber, day, 15, 0, 0);
        return date.toISOString();
      }
    }
    
    // Fall back to default date
    return "2025-05-25T15:00:00.000Z";
  } catch (error) {
    console.error("Error parsing date:", error);
    return "2025-05-25T15:00:00.000Z";
  }
}
