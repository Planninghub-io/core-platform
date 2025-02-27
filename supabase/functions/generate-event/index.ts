
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { CreateCompletionRequest } from "https://esm.sh/openai@4.20.1";

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

    // Generate event details using OpenAI
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

      // Validate required fields
      const requiredFields = ['title', 'description', 'location', 'category', 'estimatedPrice'] as const;
      const missingFields = requiredFields.filter(field => !event[field]);

      if (missingFields.length > 0) {
        return new Response(
          JSON.stringify({
            needsInfo: true,
            missingFields,
            message: `Please provide: ${missingFields.join(', ')}`
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate image for the event
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
