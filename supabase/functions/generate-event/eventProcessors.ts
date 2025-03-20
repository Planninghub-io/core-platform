
// Event processing logic

import { extractEventDetails } from './eventExtractors.ts';
import { generateEventWithAI, generateEventImage } from './openaiService.ts';
import { createSuccessResponse, createErrorResponse } from './responseUtils.ts';
import type { EventData } from './types.ts';

/**
 * Parse and normalize date strings for consistency
 */
function normalizeDate(dateStr: string): string {
  if (!dateStr) return '';
  
  try {
    // Handle ISO date strings from frontend
    if (dateStr.includes('T')) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        // Keep ISO format but ensure it's valid
        return date.toISOString();
      }
    }
    
    // Handle date strings with time components like "March 20th at 6PM"
    const monthMatch = dateStr.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?)?/i);
    if (monthMatch) {
      const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
      const month = monthNames.indexOf(monthMatch[1].toLowerCase());
      const day = parseInt(monthMatch[2]);
      const year = monthMatch[3] ? parseInt(monthMatch[3]) : new Date().getFullYear();
      
      let hours = 0;
      let minutes = 0;
      
      if (monthMatch[4]) {
        hours = parseInt(monthMatch[4]);
        if (monthMatch[6] && monthMatch[6].toLowerCase() === 'pm' && hours < 12) {
          hours += 12;
        }
        if (monthMatch[6] && monthMatch[6].toLowerCase() === 'am' && hours === 12) {
          hours = 0;
        }
        
        minutes = monthMatch[5] ? parseInt(monthMatch[5]) : 0;
      }
      
      const date = new Date(year, month, day, hours, minutes);
      return date.toISOString();
    }
    
    // Parse time zone abbreviations like "CT", "ET", etc.
    if (dateStr.match(/\b(CT|ET|PT|MT)\b/i)) {
      const timeZoneMap: Record<string, number> = {
        'CT': -6, // Central Time
        'ET': -5, // Eastern Time
        'PT': -8, // Pacific Time
        'MT': -7  // Mountain Time
      };
      
      // Extract the time zone abbreviation
      const tzMatch = dateStr.match(/\b(CT|ET|PT|MT)\b/i);
      if (tzMatch) {
        const tzAbbr = tzMatch[1].toUpperCase();
        const tzOffset = timeZoneMap[tzAbbr];
        
        // Extract date and time components
        const dateTimeMatch = dateStr.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?)?/i);
        
        if (dateTimeMatch) {
          const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
          const month = monthNames.indexOf(dateTimeMatch[1].toLowerCase());
          const day = parseInt(dateTimeMatch[2]);
          const year = dateTimeMatch[3] ? parseInt(dateTimeMatch[3]) : new Date().getFullYear();
          
          let hours = 0;
          let minutes = 0;
          
          if (dateTimeMatch[4]) {
            hours = parseInt(dateTimeMatch[4]);
            if (dateTimeMatch[6] && dateTimeMatch[6].toLowerCase() === 'pm' && hours < 12) {
              hours += 12;
            }
            if (dateTimeMatch[6] && dateTimeMatch[6].toLowerCase() === 'am' && hours === 12) {
              hours = 0;
            }
            
            minutes = dateTimeMatch[5] ? parseInt(dateTimeMatch[5]) : 0;
          }
          
          // Create date in UTC
          const date = new Date(Date.UTC(year, month, day, hours - tzOffset, minutes));
          return date.toISOString();
        }
      }
    }
  } catch (e) {
    console.error('Error normalizing date:', e);
  }
  
  // Return original if we couldn't parse it
  return dateStr;
}

/**
 * Extract location from a string that may contain time information
 */
function extractLocationFromMixedString(inputStr: string): string {
  // Remove time patterns like "9 AM CT", "9:00 AM", etc.
  return inputStr.replace(/\b\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?(?:\s+(?:CT|ET|PT|MT))?\b/g, '').trim();
}

/**
 * Generate response using extracted information
 */
export async function generateResponseWithExtractedInfo(
  extractedEvent: Partial<EventData>, 
  fullPrompt: string
): Promise<Response> {
  try {
    // Normalize date format if present
    if (extractedEvent.date) {
      extractedEvent.date = normalizeDate(extractedEvent.date);
    }
    
    // Clean up location if it contains time information
    if (extractedEvent.location && extractedEvent.location.match(/\b\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?(?:\s+(?:CT|ET|PT|MT))?\b/)) {
      extractedEvent.location = extractLocationFromMixedString(extractedEvent.location);
    }
    
    // Generate a better title if the current one is just a month name
    if (extractedEvent.title && ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].includes(extractedEvent.title.toLowerCase())) {
      // Use the prompt to generate a more descriptive title
      if (fullPrompt.toLowerCase().includes('fundraiser')) {
        extractedEvent.title = `${extractedEvent.location || ''} Fundraiser`.trim();
      } else if (fullPrompt.toLowerCase().includes('meeting')) {
        extractedEvent.title = `${extractedEvent.location || ''} Meeting`.trim();
      } else if (fullPrompt.toLowerCase().includes('conference')) {
        extractedEvent.title = `${extractedEvent.location || ''} Conference`.trim();
      } else if (fullPrompt.toLowerCase().includes('party')) {
        extractedEvent.title = `${extractedEvent.location || ''} Party`.trim();
      } else {
        extractedEvent.title = `${extractedEvent.location || ''} Event`.trim();
      }
    }
    
    // Clean up description by removing redundant "Additional details" text
    if (extractedEvent.description) {
      extractedEvent.description = extractedEvent.description.replace(/Additional details: (?:date|location|budget): [^.]+(?:, )?/g, '').trim();
    }
    
    // Create a basic image prompt from title and location
    extractedEvent.imagePrompt = `An event "${extractedEvent.title || "social gathering"}" at ${extractedEvent.location || "a venue"}`;

    // Generate image for the event
    const imageUrl = await generateEventImage(extractedEvent.imagePrompt);

    return createSuccessResponse({
      ...extractedEvent,
      imageUrl
    });
  } catch (error) {
    console.error('Error in generateResponseWithExtractedInfo:', error);
    return createErrorResponse(error);
  }
}

/**
 * Generate response using AI when extracted information is insufficient
 */
export async function generateResponseWithAI(
  fullPrompt: string, 
  extractedEvent: Partial<EventData>
): Promise<Response> {
  try {
    // Use OpenAI to generate event details
    const aiGeneratedEvent = await generateEventWithAI(fullPrompt);
    
    // Combine extracted data with AI-generated data
    const combinedEvent = {
      ...aiGeneratedEvent,
      title: aiGeneratedEvent.title || extractedEvent.title || "",
      description: aiGeneratedEvent.description || extractedEvent.description || "",
      location: aiGeneratedEvent.location || extractedEvent.location || "",
      date: aiGeneratedEvent.date || extractedEvent.date || "",
      category: aiGeneratedEvent.category || extractedEvent.category || "Other",
      estimatedPrice: aiGeneratedEvent.estimatedPrice || extractedEvent.estimatedPrice || "Free",
      imagePrompt: aiGeneratedEvent.imagePrompt || 
                  `An event "${aiGeneratedEvent.title || extractedEvent.title}" at ${aiGeneratedEvent.location || extractedEvent.location}`,
    };
    
    // Clean up location if it contains time information
    if (combinedEvent.location && combinedEvent.location.match(/\b\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?(?:\s+(?:CT|ET|PT|MT))?\b/)) {
      combinedEvent.location = extractLocationFromMixedString(combinedEvent.location);
    }
    
    // Normalize date format if present
    if (combinedEvent.date) {
      combinedEvent.date = normalizeDate(combinedEvent.date);
    }

    // Generate image for the event
    const imageUrl = await generateEventImage(combinedEvent.imagePrompt || "An elegant event venue");

    return createSuccessResponse({
      ...combinedEvent,
      imageUrl
    });
  } catch (error) {
    console.error('Error in generateResponseWithAI:', error);
    return createErrorResponse(error);
  }
}

/**
 * Process the request and generate event details
 */
export async function processRequest(prompt: string, additionalInfo: any): Promise<Response> {
  try {
    console.log('Processing request with prompt:', prompt, 'Additional info:', additionalInfo);
    
    // Check if additionalInfo includes date/time information before processing
    if (additionalInfo && additionalInfo.date) {
      console.log(`Received date information: ${additionalInfo.date}`);
      // Normalize the date format
      additionalInfo.date = normalizeDate(additionalInfo.date);
    }
    
    // Combine prompt with additional info if provided
    let fullPrompt = prompt;
    if (additionalInfo && Object.keys(additionalInfo).length > 0) {
      const additionalDetails = Object.entries(additionalInfo)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      fullPrompt = `${prompt}. Additional details: ${additionalDetails}`;
    }

    // Extract event details from prompt
    const extractedEvent = extractEventDetails(fullPrompt);
    
    // Add any manually provided fields from additionalInfo
    if (additionalInfo) {
      if (additionalInfo.date && !extractedEvent.date) {
        extractedEvent.date = additionalInfo.date;
      }
      if (additionalInfo.location && !extractedEvent.location) {
        extractedEvent.location = additionalInfo.location;
      }
      if (additionalInfo.budget && !extractedEvent.estimatedPrice) {
        extractedEvent.estimatedPrice = additionalInfo.budget;
      }
    }
    
    console.log('Extracted event data:', extractedEvent);

    // Check if we have enough extracted information
    const hasMinimumInfo = (
      extractedEvent.title || 
      extractedEvent.location || 
      (additionalInfo && additionalInfo.date) || 
      (additionalInfo && additionalInfo.location) ||
      (additionalInfo && additionalInfo.budget)
    );
    
    if (hasMinimumInfo) {
      return await generateResponseWithExtractedInfo(extractedEvent, fullPrompt);
    } else {
      return await generateResponseWithAI(fullPrompt, extractedEvent);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return createErrorResponse(error);
  }
}
