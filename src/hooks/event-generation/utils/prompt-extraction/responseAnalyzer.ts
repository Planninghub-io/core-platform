
/**
 * Utilities for analyzing user responses
 */

/**
 * Check if a prompt response already contains requested information
 * @param promptText User's response text to analyze
 * @param requestedFields Array of fields that were requested
 * @returns Object with boolean indicating if all requested fields were provided
 */
export const checkIfResponseContainsRequestedInfo = (
  promptText: string,
  requestedFields: string[],
  extractFunctions: Record<string, (text: string) => string | null>
): { containsAllInfo: boolean; extractedInfo: Record<string, string | null> } => {
  const extractedInfo: Record<string, string | null> = {};
  
  // Only check fields that were requested
  for (const field of requestedFields) {
    if (extractFunctions[field]) {
      extractedInfo[field] = extractFunctions[field](promptText);
    }
  }
  
  // Check if we found all requested fields
  const containsAllInfo = requestedFields.every(field => 
    extractedInfo[field] !== null && extractedInfo[field] !== undefined
  );
  
  return { containsAllInfo, extractedInfo };
};
