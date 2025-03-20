
import { useState } from "react";
import { checkResponseForRequestedInfo } from "../utils/prompt-extraction";

/**
 * Hook for checking and extracting information from user responses
 */
export const useResponseChecker = () => {
  const [previouslyRequestedFields, setPreviouslyRequestedFields] = useState<string[]>([]);

  /**
   * Check if a user's response contains information we previously asked for
   */
  const checkUserResponse = (
    prompt: string,
    previouslyRequestedFields: string[]
  ): {
    containsAllInfo: boolean;
    extractedInfo: Record<string, string | null>;
    updatedProvidedInfo: Record<string, string>;
  } => {
    const providedInfo: Record<string, string> = {};
    
    if (previouslyRequestedFields.length > 0) {
      const { containsAllInfo, extractedInfo } = checkResponseForRequestedInfo(
        prompt,
        previouslyRequestedFields
      );
      
      console.log("Checking if response contains previously requested info:", { 
        previouslyRequestedFields,
        containsAllInfo,
        extractedInfo
      });
      
      // If we found information in the response, add it to provided info
      if (containsAllInfo) {
        Object.entries(extractedInfo).forEach(([key, value]) => {
          if (value) providedInfo[key] = value;
        });
      }
      
      return { 
        containsAllInfo, 
        extractedInfo, 
        updatedProvidedInfo: providedInfo 
      };
    }
    
    return { 
      containsAllInfo: false, 
      extractedInfo: {}, 
      updatedProvidedInfo: {} 
    };
  };

  return {
    previouslyRequestedFields,
    setPreviouslyRequestedFields,
    checkUserResponse
  };
};
