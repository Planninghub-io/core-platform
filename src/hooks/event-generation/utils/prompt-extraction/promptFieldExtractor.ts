
/**
 * Main utilities for extracting fields from prompts
 */
import { extractDateFromPrompt } from './dateExtractor';
import { extractLocationFromPrompt } from './locationExtractor';
import { extractBudgetFromPrompt } from './budgetExtractor';
import { checkIfResponseContainsRequestedInfo } from './responseAnalyzer';

/**
 * Extract multiple fields from a prompt and combine with existing data
 * 
 * @param promptText The user prompt to analyze
 * @param missingInfoData Data about what fields are missing
 * @param existingInfo Existing information already provided
 * @returns Object containing extracted fields merged with existing info
 */
export const extractFieldsFromPrompt = (
  promptText: string, 
  missingInfoData: any, 
  existingInfo: Record<string, string>
): Record<string, string> => {
  const prePopulatedInfo = { ...existingInfo };
  
  // Extract date if it's needed and not already provided
  if (missingInfoData.missingFields && missingInfoData.missingFields.includes('date') && !prePopulatedInfo.date) {
    const extractedDate = extractDateFromPrompt(promptText);
    if (extractedDate) {
      prePopulatedInfo.date = extractedDate;
    }
  }
  
  // Extract location if it's needed and not already provided
  if (missingInfoData.missingFields && missingInfoData.missingFields.includes('location') && !prePopulatedInfo.location) {
    const extractedLocation = extractLocationFromPrompt(promptText);
    if (extractedLocation) {
      prePopulatedInfo.location = extractedLocation;
    }
  }
  
  // Extract budget if it's needed and not already provided
  if (missingInfoData.missingFields && missingInfoData.missingFields.includes('budget') && !prePopulatedInfo.budget) {
    const extractedBudget = extractBudgetFromPrompt(promptText);
    if (extractedBudget) {
      prePopulatedInfo.budget = extractedBudget;
    }
  }
  
  return prePopulatedInfo;
};

/**
 * Main extraction function to get all event details from a prompt
 * @param promptText The user prompt to analyze
 * @returns Object containing extracted fields
 */
export const extractAllDetailsFromPrompt = (promptText: string): Record<string, string | null> => {
  return {
    date: extractDateFromPrompt(promptText),
    location: extractLocationFromPrompt(promptText),
    budget: extractBudgetFromPrompt(promptText)
  };
};

/**
 * Extract missing fields from missing info data
 * @param missingInfo Object containing information about missing fields
 * @returns Array of missing field names
 */
export const extractMissingFields = (missingInfo: any): string[] => {
  if (!missingInfo || !missingInfo.missingFields) {
    return [];
  }
  return missingInfo.missingFields || [];
};

// Reexport the individual extractors for direct use
export {
  extractDateFromPrompt,
  extractLocationFromPrompt,
  extractBudgetFromPrompt
};

// Create a function map to be used by the response analyzer
export const extractorFunctions = {
  date: extractDateFromPrompt,
  location: extractLocationFromPrompt,
  budget: extractBudgetFromPrompt
};

// Re-export checkIfResponseContainsRequestedInfo with default parameters
export const checkResponseForRequestedInfo = (
  promptText: string,
  requestedFields: string[]
) => {
  return checkIfResponseContainsRequestedInfo(promptText, requestedFields, extractorFunctions);
};
