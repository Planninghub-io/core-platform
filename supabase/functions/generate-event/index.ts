
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
            content: `You are an event planning assistant. Analyze the user's input and respond with ONE of these two JSON formats:

1. If you have enough information to generate a complete event (must include at minimum a clear title and basic description), return:
{
  "title": "Clear and descriptive event title",
  "description": "Detailed event description",
  "date": "Event date and time",
  "location": "Event location",
  "category": "Event category",
  "estimatedPrice": "Price estimate",
  "imagePrompt": "Description for image generation"
}

2. If ANY critical information is missing (including title, date, or location), return:
{
  "needsInfo": true,
  "missingFields": ["list", "of", "missing", "fields"],
  "message": "Please provide: [list missing information]"
}

IMPORTANT:
- NEVER return a mixed or partial response
- NEVER return an event without a title
- If in doubt about having enough information, use format #2 to request more details`
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

      // Additional validation to ensure we have either a valid event or a proper needsInfo response
      if (eventDetails.needsInfo === true) {
        if (!Array.isArray(eventDetails.missingFields) || !eventDetails.message) {
          throw new Error('Invalid needsInfo response format');
        }
      } else {
        if (!eventDetails.title || typeof eventDetails.title !== 'string' || eventDetails.title.trim() === '') {
          throw new Error('Generated event must have a title');
        }
      }
    } catch (parseError) {
      console.error('Failed to parse or validate AI response:', aiResponse);
      throw new Error('Invalid response format from AI');
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
