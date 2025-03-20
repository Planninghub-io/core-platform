
// Event processing logic
import { extractEventDetails } from './eventExtractors.ts';
import { generateEventWithAI, generateEventImage } from './openaiService.ts';
import { createSuccessResponse, createErrorResponse } from './responseUtils.ts';
import { enhanceEventData, combineEventData, hasMinimumEventInfo } from './eventEnhancer.ts';
import type { EventData } from './types.ts';

/**
 * Generate response using extracted information
 */
export async function generateResponseWithExtractedInfo(
  extractedEvent: Partial<EventData>, 
  fullPrompt: string
): Promise<Response> {
  try {
    // Enhance event data with improved fields
    const enhancedEvent = enhanceEventData(extractedEvent, fullPrompt);
    
    // Generate image for the event
    const imageUrl = await generateEventImage(enhancedEvent.imagePrompt || "An elegant event venue");

    return createSuccessResponse({
      ...enhancedEvent,
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
    const combinedEvent = combineEventData(aiGeneratedEvent, extractedEvent);
    
    // Enhance the combined event data
    const enhancedEvent = enhanceEventData(combinedEvent, fullPrompt);

    // Generate image for the event
    const imageUrl = await generateEventImage(enhancedEvent.imagePrompt || "An elegant event venue");

    return createSuccessResponse({
      ...enhancedEvent,
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
    if (hasMinimumEventInfo(extractedEvent, additionalInfo)) {
      return await generateResponseWithExtractedInfo(extractedEvent, fullPrompt);
    } else {
      return await generateResponseWithAI(fullPrompt, extractedEvent);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return createErrorResponse(error);
  }
}
