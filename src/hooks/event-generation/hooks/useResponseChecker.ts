
import { useState } from "react";
import { 
  checkResponseForRequestedInfo,
  extractorFunctions 
} from "../utils/prompt-extraction";

/**
 * Hook to check user responses against previously requested fields
 */
export const useResponseChecker = () => {
  const [previouslyRequestedFields, setPreviouslyRequestedFields] = useState<string[]>([]);

  /**
   * Check if a user's response contains information we previously asked for
   */
  const checkUserResponse = (
    prompt: string, 
    requestedFields: string[]
  ) => {
    if (!requestedFields || !requestedFields.length) {
      return { containsAllInfo: false, extractedInfo: {} };
    }

    console.log("Checking user response for fields:", requestedFields);

    // Extract requested information from the prompt
    const extractedInfo: Record<string, string | null> = {};
    
    for (const field of requestedFields) {
      if (extractorFunctions[field]) {
        extractedInfo[field] = extractorFunctions[field](prompt);
        console.log(`Extracted ${field}:`, extractedInfo[field]);
      }
    }
    
    // Filter out null values
    const validExtractedInfo: Record<string, string> = {};
    for (const [key, value] of Object.entries(extractedInfo)) {
      if (value !== null) {
        validExtractedInfo[key] = value;
      }
    }
    
    // Check if we found all requested fields
    const containsAllInfo = requestedFields.every(
      field => validExtractedInfo[field] !== undefined
    );
    
    console.log("Contains all requested info:", containsAllInfo);
    console.log("Valid extracted info:", validExtractedInfo);
    
    return { 
      containsAllInfo, 
      extractedInfo: validExtractedInfo 
    };
  };

  return {
    previouslyRequestedFields,
    setPreviouslyRequestedFields,
    checkUserResponse
  };
};
