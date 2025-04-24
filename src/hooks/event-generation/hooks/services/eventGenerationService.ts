
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
    
    // Very simple event generation for demo purposes
    // This would normally call an AI service
    const eventData = {
      title: getEventTitle(prompt),
      description: `Celebrate a special day at the beautiful wedding on May 30th. Join us for this memorable wedding event.`,
      date: "2025-05-30T00:00:00.000Z",
      location: "New York City",
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
