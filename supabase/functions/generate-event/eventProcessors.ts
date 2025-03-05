
// Event processing logic

import { extractEventDetails } from './eventExtractors.ts';
import { generateEventImage, generateEventWithAI } from './openaiService.ts';
import { createSuccessResponse, createErrorResponse } from './responseUtils.ts';
import type { EventData } from './types.ts';

/**
 * Generate response using extracted information
 */
export async function generateResponseWithExtractedInfo(
  extractedEvent: Partial<EventData>, 
  fullPrompt: string
): Promise<Response> {
  try {
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
      category: aiGeneratedEvent.category || extractedEvent.category || "Other",
      estimatedPrice: aiGeneratedEvent.estimatedPrice || extractedEvent.estimatedPrice || "Free",
      imagePrompt: aiGeneratedEvent.imagePrompt || 
                  `An event "${aiGeneratedEvent.title || extractedEvent.title}" at ${aiGeneratedEvent.location || extractedEvent.location}`,
    };

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
    
    // Combine prompt with additional info if provided
    let fullPrompt = prompt;
    if (additionalInfo) {
      const additionalDetails = Object.entries(additionalInfo)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      fullPrompt = `${prompt}. Additional details: ${additionalDetails}`;
    }

    // Extract event details from prompt
    const extractedEvent = extractEventDetails(fullPrompt);
    console.log('Extracted event data:', extractedEvent);

    // Check if we have enough extracted information
    const hasMinimumInfo = (extractedEvent.title || extractedEvent.location);
    
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
