
/**
 * Utility functions for analyzing responses to see if they contain requested information
 */

type ExtractorFunction = (text: string) => string | null;

/**
 * Check if a response contains information that was specifically requested
 * @param responseText The text to analyze
 * @param requestedFields Array of field names that were requested
 * @param extractors Object mapping field names to extractor functions
 * @returns Object with extracted information and missing fields
 */
export const checkIfResponseContainsRequestedInfo = (
  responseText: string,
  requestedFields: string[],
  extractors: Record<string, ExtractorFunction>
): {
  extractedInfo: Record<string, string | null>;
  stillMissingFields: string[];
  hasAllRequestedInfo: boolean;
} => {
  const extractedInfo: Record<string, string | null> = {};
  const stillMissingFields: string[] = [];
  
  // Try to extract each requested field
  for (const field of requestedFields) {
    if (extractors[field]) {
      const extractedValue = extractors[field](responseText);
      
      extractedInfo[field] = extractedValue;
      
      if (!extractedValue) {
        stillMissingFields.push(field);
      }
    } else {
      // If we don't have an extractor for this field, consider it missing
      stillMissingFields.push(field);
    }
  }
  
  return {
    extractedInfo,
    stillMissingFields,
    hasAllRequestedInfo: stillMissingFields.length === 0
  };
};
