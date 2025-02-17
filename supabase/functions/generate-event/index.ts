
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log('Starting event generation for prompt:', prompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an event planning assistant. Generate JSON response based on the user's event description.
            The only required fields are date/time and location.
            
            Response format when critical information is missing:
            {
              "needsInfo": true,
              "missingFields": ["datetime", "location"],
              "message": "Please provide the following details to help plan your event"
            }
            
            Response format when all information is present:
            {
              "needsInfo": false,
              "title": "Event title",
              "description": "Detailed description",
              "date": "2024-03-20T18:00:00Z",
              "location": "Venue name and address",
              "category": "Event category",
              "estimatedPrice": "$XX.XX",
              "imagePrompt": "Detailed image generation prompt"
            }`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error response:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response format from OpenAI');
    }

    const aiResponse = data.choices[0].message.content;
    let eventDetails;
    try {
      eventDetails = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', aiResponse);
      throw new Error('Failed to parse event details from AI response');
    }

    if (typeof eventDetails.needsInfo !== 'boolean') {
      console.error('Invalid event details structure:', eventDetails);
      throw new Error('Invalid event details structure');
    }

    return new Response(JSON.stringify(eventDetails), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Generate event error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate event. Please try again.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
