
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

    console.log('Sending request to OpenAI with prompt:', prompt);

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
            content: `You are an event planning assistant. Analyze the user's event description and identify if it's missing critical information like date/time or location. 
            If information is missing, return a JSON response with 'needsInfo: true' and specify what information is needed.
            If all required information is present, generate structured event details.
            
            Response format when information is missing:
            {
              "needsInfo": true,
              "missingFields": ["date", "time", "city", "region"],
              "message": "Please provide: [list what's needed]"
            }
            
            Response format when all information is present:
            {
              "needsInfo": false,
              "title": "string",
              "description": "string",
              "date": "string (ISO format)",
              "location": "string",
              "category": "string",
              "estimatedPrice": "string",
              "imagePrompt": "string"
            }
            
            Always ensure dates are in the future and properly formatted.`
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    console.log('OpenAI response status:', response.status);

    const responseData = await response.text();
    console.log('Raw OpenAI response:', responseData);

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${responseData}`);
    }

    const data = JSON.parse(responseData);
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    let eventDetails;
    try {
      eventDetails = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', data.choices[0].message.content);
      throw new Error('Failed to parse event details from AI response');
    }

    console.log('Successfully generated event details:', eventDetails);

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
