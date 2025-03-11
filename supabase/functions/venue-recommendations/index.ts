
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { location, eventType, preferredFeatures } = await req.json();

    console.log(`Searching for venues with: location=${location}, eventType=${eventType}, features=${preferredFeatures}`);

    // First, get venues from Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    const fetchVenues = await fetch(`${supabaseUrl}/rest/v1/venues?select=*`, {
      headers: {
        'apikey': supabaseKey as string,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    const venues = await fetchVenues.json();
    console.log(`Found ${venues.length} venues in database`);

    // Generate AI-based recommendations based on the venues, location, and event type
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are a venue recommendation expert. You will receive a list of venues and user preferences, and your task is to:
            1. Select 3-5 venues that best match the user's location and event type preferences
            2. For each venue, explain why it's a good match
            3. Add any special considerations for the event type
            4. Format your response as a JSON array of objects with the following properties:
              - venueId: the id of the venue
              - matchScore: a number from 0-100 indicating how well it matches
              - reason: a brief explanation of why this venue is recommended
              - specialConsiderations: any tips for using this venue for the specified event type`
          },
          {
            role: 'user',
            content: `Location: ${location}\nEvent Type: ${eventType}\nPreferred Features: ${preferredFeatures || 'None specified'}\n\nVenues:\n${JSON.stringify(venues, null, 2)}`
          }
        ],
        temperature: 0.7,
      }),
    });

    const aiResult = await openAIResponse.json();
    console.log("AI response received");

    // Parse the AI response
    let recommendations = [];
    try {
      // The AI model should return JSON, but it might be embedded in text
      const contentText = aiResult.choices[0].message.content;
      // Extract JSON if it's embedded in text
      const jsonMatch = contentText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        // Try to parse the whole content as JSON
        recommendations = JSON.parse(contentText);
      }
    } catch (error) {
      console.error("Error parsing AI response:", error);
      // If parsing fails, use the raw text
      recommendations = [{
        venueId: null,
        matchScore: 0,
        reason: "Error processing recommendations. Please try again.",
        specialConsiderations: aiResult.choices[0].message.content
      }];
    }

    // Enhance recommendations with full venue data
    const enhancedRecommendations = recommendations.map(rec => {
      const venueData = venues.find(v => v.id === rec.venueId) || null;
      return {
        ...rec,
        venue: venueData
      };
    });

    return new Response(
      JSON.stringify({ 
        recommendations: enhancedRecommendations,
        query: { location, eventType, preferredFeatures }
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in venue recommendations function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
