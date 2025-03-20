
// Main extractor that combines all specialized extractors
import { extractTitle, formatTitle, handleMonthNameTitle } from './titleExtractor.ts';
import { extractDateTime } from './dateTimeExtractor.ts';
import { extractLocation } from './locationExtractor.ts';
import { generateDescription, extractDescriptionFromPrompt, determineCategory } from './descriptionExtractor.ts';
import { extractPrice } from './priceExtractor.ts';
import { checkMissingFields } from './validationUtils.ts';
import type { EventData } from '../types.ts';

/**
 * Extract all event details from prompt
 */
export function extractEventDetails(prompt: string): Partial<EventData> {
  // Extract basic event components
  const extractedTitle = extractTitle(prompt);
  const dateTime = extractDateTime(prompt);
  const location = extractLocation(prompt);
  
  // Format and enhance title
  let title = formatTitle(extractedTitle, prompt, location);
  title = handleMonthNameTitle(title, prompt, location);
  
  // Extract or generate description
  const extractedDescription = extractDescriptionFromPrompt(prompt);
  const generatedDescription = generateDescription(title || "", location || "", prompt);
  const description = extractedDescription || generatedDescription || prompt;
  
  // Determine category and price
  const category = determineCategory(prompt);
  const price = extractPrice(prompt);
  
  // Assemble the event data
  const eventData: Partial<EventData> = {
    title: title || "",
    description: description,
    date: dateTime || "",
    location: location || "",
    category,
    estimatedPrice: price,
  };
  
  return eventData;
}

// Export functions for use in other files
export {
  extractTitle,
  extractDateTime,
  extractLocation,
  checkMissingFields
};
