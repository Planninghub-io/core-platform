
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, additionalInfo } = await req.json();
    console.log('Received prompt:', prompt, 'Additional info:', additionalInfo);

    // Combine prompt with additional info if provided
    let fullPrompt = prompt;
    if (additionalInfo) {
      const additionalDetails = Object.entries(additionalInfo)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      fullPrompt = `${prompt}. Additional details: ${additionalDetails}`;
    }

    // Parse title, description, location, etc. from the prompt
    // This is a simple heuristic approach to extract information
    const titleMatch = prompt.match(/title:?\s*([^,.]+)/i);
    const descriptionMatch = prompt.match(/description:?\s*([^,.]+(?:[^.]+)?)/i);
    const locationMatch = prompt.match(/location:?\s*([^,.]+)/i) || prompt.match(/in\s+([^,.]+)/i) || prompt.match(/at\s+([^,.]+(?:,[^,.]+)?)/i);
    const categoryMatch = prompt.match(/category:?\s*([^,.]+)/i);
    const priceMatch = prompt.match(/price:?\s*([^,.]+)/i) || prompt.match(/estimatedPrice:?\s*([^,.]+)/i) || prompt.match(/cost:?\s*([^,.]+)/i);

    // Default description if one wasn't provided
    let defaultDescription = prompt;
    if (titleMatch) {
      defaultDescription = `Event: ${prompt}`;
    }

    // Use extracted data if possible, otherwise generate with API
    const extractedEvent: Partial<GeneratedEvent> = {
      title: titleMatch ? titleMatch[1].trim() : "",
      description: descriptionMatch ? descriptionMatch[1].trim() : defaultDescription,
      location: locationMatch ? locationMatch[1].trim() : "",
      category: categoryMatch ? categoryMatch[1].trim() : "Other",
      estimatedPrice: priceMatch ? priceMatch[1].trim() : "Free",
    };

    console.log('Extracted event data:', extractedEvent);

    // If we have enough extracted information, use it without calling OpenAI
    const hasMinimumInfo = extractedEvent.title && extractedEvent.location;
    
    if (hasMinimumInfo) {
      // Create a basic image prompt from title and location
      extractedEvent.imagePrompt = `An event "${extractedEvent.title}" at ${extractedEvent.location}`;

      // Generate image for the event using the extracted data
      try {
        const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: extractedEvent.imagePrompt,
            n: 1,
            size: "1024x1024"
          })
        });

        const imageData = await imageResponse.json();
        const imageUrl = imageData.data?.[0]?.url;

        return new Response(
          JSON.stringify({
            ...extractedEvent,
            imageUrl
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Error generating image:', error);
        // If image generation fails, still return the event data
        return new Response(
          JSON.stringify({
            ...extractedEvent
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // If we don't have enough information, use OpenAI to generate event details
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
            content: `Create an event based on this description: ${fullPrompt}. 
            Include a catchy title, detailed description, location, category, and estimated price range.
            Also create a detailed image prompt that captures the event's atmosphere.`
          }
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
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

      // Validate required fields and combine with extracted data
      event = {
        ...event,
        title: event.title || extractedEvent.title || "",
        description: event.description || extractedEvent.description || "",
        location: event.location || extractedEvent.location || "",
        category: event.category || extractedEvent.category || "Other",
        estimatedPrice: event.estimatedPrice || extractedEvent.estimatedPrice || "Free",
        imagePrompt: event.imagePrompt || `An event "${event.title || extractedEvent.title}" at ${event.location || extractedEvent.location}`,
      };

      // Generate image for the event
      try {
        const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: event.imagePrompt,
            n: 1,
            size: "1024x1024"
          })
        });

        const imageData = await imageResponse.json();
        const imageUrl = imageData.data?.[0]?.url;

        return new Response(
          JSON.stringify({
            ...event,
            imageUrl
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Error generating image:', error);
        // If image generation fails, still return the event data
        return new Response(
          JSON.stringify({
            ...event
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

    } catch (error) {
      console.error('Error parsing event details:', error);
      throw new Error('Failed to parse event details');
    }

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
