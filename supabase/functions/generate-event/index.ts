
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeneratedEvent {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  estimatedPrice: string;
  imagePrompt: string;
}

// Extract title from prompt using various patterns
function extractTitle(prompt: string): string {
  // Wedding pattern
  let titleMatch = prompt.match(/(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:'s)?(?:\s+[A-Za-z]+)?)(?:\s+wedding|\s+event)/i);
  if (!titleMatch) {
    // Birthday pattern
    titleMatch = prompt.match(/(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:'s)?(?:\s+[A-Za-z]+)?)(?:\s+birthday)/i);
  }
  if (!titleMatch) {
    // Conference/Meeting pattern
    titleMatch = prompt.match(/(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:\s+[A-Za-z]+){0,2})(?:\s+conference|\s+meeting|\s+workshop)/i);
  }
  if (!titleMatch) {
    // Generic event with name
    titleMatch = prompt.match(/(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:'s)?(?:\s+[A-Za-z]+){0,2})(?:\s+in\s+|(?:\s+at\s+))/i);
  }
  
  // Fallback title extraction - try to identify a proper noun or capitalized phrase
  if (!titleMatch) {
    titleMatch = prompt.match(/\b([A-Z][a-z]+(?:'s)?(?:\s+[A-Z][a-z]+){0,2})\b/);
  }

  const extractedTitle = titleMatch ? titleMatch[1].trim() : "";
  
  // Format title based on what we found (Wedding, Birthday, etc.)
  if (extractedTitle && prompt.toLowerCase().includes("wedding")) {
    return `${extractedTitle}'s Wedding`;
  } else if (extractedTitle && prompt.toLowerCase().includes("birthday")) {
    return `${extractedTitle}'s Birthday`;
  }
  
  return extractedTitle;
}

// Extract other event details from prompt
function extractEventDetails(prompt: string): Partial<GeneratedEvent> {
  const descriptionMatch = prompt.match(/description:?\s*([^,.]+(?:[^.]+)?)/i);
  const locationMatch = prompt.match(/location:?\s*([^,.]+)/i) || prompt.match(/in\s+([^,.]+)/i) || prompt.match(/at\s+([^,.]+(?:,[^,.]+)?)/i);
  const categoryMatch = prompt.match(/category:?\s*([^,.]+)/i);
  const priceMatch = prompt.match(/price:?\s*([^,.]+)/i) || prompt.match(/estimatedPrice:?\s*([^,.]+)/i) || prompt.match(/cost:?\s*([^,.]+)/i);

  // Default description if one wasn't provided
  let defaultDescription = prompt;
  
  const formattedTitle = extractTitle(prompt);
  
  // Determine category based on event type mentions
  let category = categoryMatch ? categoryMatch[1].trim() : "";
  if (!category) {
    if (prompt.toLowerCase().includes("wedding")) {
      category = "Wedding";
    } else if (prompt.toLowerCase().includes("birthday")) {
      category = "Birthday Party";
    } else {
      category = "Other";
    }
  }
  
  return {
    title: formattedTitle || "",
    description: descriptionMatch ? descriptionMatch[1].trim() : defaultDescription,
    location: locationMatch ? locationMatch[1].trim() : "",
    category,
    estimatedPrice: priceMatch ? priceMatch[1].trim() : "Free",
  };
}

// Generate image for event using OpenAI
async function generateEventImage(imagePrompt: string): Promise<string | null> {
  try {
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024"
      })
    });

    if (!imageResponse.ok) {
      console.error('Image generation error:', await imageResponse.text());
      return null;
    }

    const imageData = await imageResponse.json();
    return imageData.data?.[0]?.url || null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

// Generate event details using OpenAI
async function generateEventWithAI(prompt: string): Promise<Partial<GeneratedEvent>> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an event planning assistant. Generate compelling event details from user prompts. 
            Always create an engaging title that captures the event's essence. 
            For image prompts, create detailed descriptions focusing on the event's atmosphere and setting.`
          },
          {
            role: "user",
            content: `Create an event based on this description: ${prompt}. 
            Include a catchy title, detailed description, location, category, and estimated price range.
            Also create a detailed image prompt that captures the event's atmosphere.`
          }
        ],
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      console.error('AI generation error:', await response.text());
      return {};
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the response and extract event details
    const lines = content.split('\n');
    let event: Partial<GeneratedEvent> = {};
    
    lines.forEach(line => {
      if (line.toLowerCase().startsWith('title:')) event.title = line.split(':')[1].trim();
      if (line.toLowerCase().startsWith('description:')) event.description = line.split(':')[1].trim();
      if (line.toLowerCase().startsWith('location:')) event.location = line.split(':')[1].trim();
      if (line.toLowerCase().startsWith('category:')) event.category = line.split(':')[1].trim();
      if (line.toLowerCase().startsWith('estimated price:')) event.estimatedPrice = line.split(':')[1].trim();
      if (line.toLowerCase().startsWith('image prompt:')) event.imagePrompt = line.split(':')[1].trim();
    });

    return event;
  } catch (error) {
    console.error('Error generating event with AI:', error);
    return {};
  }
}

// Process the request and generate event details
async function processRequest(prompt: string, additionalInfo: any): Promise<Response> {
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

// Generate response using extracted information
async function generateResponseWithExtractedInfo(
  extractedEvent: Partial<GeneratedEvent>, 
  fullPrompt: string
): Promise<Response> {
  // Create a basic image prompt from title and location
  extractedEvent.imagePrompt = `An event "${extractedEvent.title || "social gathering"}" at ${extractedEvent.location || "a venue"}`;

  // Generate image for the event
  const imageUrl = await generateEventImage(extractedEvent.imagePrompt);

  return createSuccessResponse({
    ...extractedEvent,
    imageUrl
  });
}

// Generate response using AI when extracted information is insufficient
async function generateResponseWithAI(
  fullPrompt: string, 
  extractedEvent: Partial<GeneratedEvent>
): Promise<Response> {
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
}

// Create success response
function createSuccessResponse(data: any): Response {
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Create error response
function createErrorResponse(error: Error): Response {
  return new Response(
    JSON.stringify({ error: error.message }),
    { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

// Handle OPTIONS request for CORS
function handleOptionsRequest(): Response {
  return new Response(null, { headers: corsHeaders });
}

// Main handler function
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleOptionsRequest();
  }

  const { prompt, additionalInfo } = await req.json();
  return await processRequest(prompt, additionalInfo);
});
