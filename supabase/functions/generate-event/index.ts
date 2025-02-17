
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
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an event planning assistant. Generate detailed event information based on the user's description.
            Always return a complete JSON response that's either:
            
            1. A complete event:
            {
              "title": "Event title",
              "description": "Detailed description",
              "date": "Event date and time",
              "location": "Event location",
              "category": "Event category",
              "estimatedPrice": "Price estimate",
              "imagePrompt": "Description for image generation"
            }

            2. OR a request for more information:
            {
              "needsInfo": true,
              "missingFields": ["date", "location"],
              "message": "Please provide the following information to help plan your event"
            }
            
            If any critical information (like date or location) is missing from the user's prompt,
            use the second format to request more details. Don't try to generate partial events.`
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
    console.log('OpenAI response:', data);
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response format from OpenAI');
    }

    const aiResponse = data.choices[0].message.content;
    console.log('AI response content:', aiResponse);
    
    let eventDetails;
    try {
      eventDetails = JSON.parse(aiResponse);
      console.log('Parsed event details:', eventDetails);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', aiResponse);
      throw new Error('Failed to parse event details from AI response');
    }

    console.log('Final event details being returned:', eventDetails);
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
