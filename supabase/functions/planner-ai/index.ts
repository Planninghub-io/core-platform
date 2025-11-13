import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function definitions for OpenAI function calling
const functions = [
  {
    name: "search_venues",
    description: "Search for venues based on location, event type, and preferred features. Use this when the user wants to find venues for their event.",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The location where the event will take place (city, state, or address)"
        },
        eventType: {
          type: "string",
          description: "The type of event (e.g., wedding, conference, birthday party, corporate event)"
        },
        preferredFeatures: {
          type: "string",
          description: "Preferred features or amenities (e.g., parking, catering, outdoor space)"
        }
      },
      required: ["location", "eventType"]
    }
  },
  {
    name: "get_venue_recommendations",
    description: "Get AI-powered venue recommendations based on location and event type. This provides personalized recommendations with match scores.",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The location where the event will take place"
        },
        eventType: {
          type: "string",
          description: "The type of event"
        },
        preferredFeatures: {
          type: "string",
          description: "Optional preferred features or amenities"
        }
      },
      required: ["location", "eventType"]
    }
  },
  {
    name: "generate_event",
    description: "Generate event details from a user's description or prompt. Use this when the user wants to create a new event or get event suggestions.",
    parameters: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "The user's description of the event they want to create"
        },
        additionalInfo: {
          type: "object",
          description: "Additional information about the event (date, location, budget, etc.)",
          properties: {
            date: { type: "string" },
            location: { type: "string" },
            budget: { type: "string" },
            attendees: { type: "string" }
          }
        }
      },
      required: ["prompt"]
    }
  },
  {
    name: "generate_checklist",
    description: "Generate a comprehensive event planning checklist based on event details. Use this when the user wants a checklist for their event.",
    parameters: {
      type: "object",
      properties: {
        eventDetails: {
          type: "object",
          description: "Details about the event",
          properties: {
            title: { type: "string" },
            category: { type: "string" },
            date: { type: "string" },
            end_date: { type: "string" },
            location: { type: "string" },
            expected_attendees: { type: "number" },
            budget: { type: "number" }
          },
          required: ["title", "date"]
        }
      },
      required: ["eventDetails"]
    }
  },
  {
    name: "get_event_suggestions",
    description: "Get suggestions for event planning based on event type, date, and other parameters. Use this to provide creative ideas and recommendations.",
    parameters: {
      type: "object",
      properties: {
        eventType: {
          type: "string",
          description: "The type of event"
        },
        date: {
          type: "string",
          description: "The date of the event"
        },
        location: {
          type: "string",
          description: "The location of the event"
        },
        attendees: {
          type: "number",
          description: "Expected number of attendees"
        }
      },
      required: ["eventType"]
    }
  }
];

// Function handlers
async function handleSearchVenues(location: string, eventType: string, preferredFeatures?: string) {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    const fetchVenues = await fetch(`${supabaseUrl}/rest/v1/venues?select=*`, {
      headers: {
        'apikey': supabaseKey as string,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    const venues = await fetchVenues.json();
    
    // Filter venues based on location if possible
    const filteredVenues = venues.filter((venue: any) => {
      if (location && venue.location) {
        return venue.location.toLowerCase().includes(location.toLowerCase());
      }
      return true;
    });

    return {
      success: true,
      venues: filteredVenues.slice(0, 10), // Limit to 10 results
      count: filteredVenues.length,
      query: { location, eventType, preferredFeatures }
    };
  } catch (error) {
    console.error('Error searching venues:', error);
    return {
      success: false,
      error: error.message,
      venues: []
    };
  }
}

async function handleGetVenueRecommendations(location: string, eventType: string, preferredFeatures?: string) {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    // Call the venue-recommendations function
    const functionUrl = `${supabaseUrl}/functions/v1/venue-recommendations`;
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ location, eventType, preferredFeatures })
    });

    const data = await response.json();
    return {
      success: true,
      recommendations: data.recommendations || [],
      query: data.query
    };
  } catch (error) {
    console.error('Error getting venue recommendations:', error);
    return {
      success: false,
      error: error.message,
      recommendations: []
    };
  }
}

async function handleGenerateEvent(prompt: string, additionalInfo?: any) {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    // Call the generate-event function
    const functionUrl = `${supabaseUrl}/functions/v1/generate-event`;
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        prompt, 
        additionalInfo,
        modelProvider: 'openai'
      })
    });

    const data = await response.json();
    return {
      success: true,
      event: data
    };
  } catch (error) {
    console.error('Error generating event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function handleGenerateChecklist(eventDetails: any) {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    // Call the generate-checklist function
    const functionUrl = `${supabaseUrl}/functions/v1/generate-checklist`;
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ eventDetails })
    });

    const data = await response.json();
    return {
      success: true,
      checklist: data.checklist || data
    };
  } catch (error) {
    console.error('Error generating checklist:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function handleGetEventSuggestions(eventType: string, date?: string, location?: string, attendees?: number) {
  // This is a helper function that uses OpenAI to generate suggestions
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  try {
    const prompt = `Provide creative event planning suggestions for a ${eventType}${date ? ` on ${date}` : ''}${location ? ` in ${location}` : ''}${attendees ? ` with ${attendees} attendees` : ''}. Include suggestions for:
- Theme and decor ideas
- Food and beverage recommendations
- Entertainment options
- Timeline suggestions
- Budget considerations
- Unique touches to make it memorable

Format as a structured list with clear sections.`;

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
            content: 'You are an expert event planner. Provide creative, practical, and detailed suggestions for events.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8
      }),
    });

    const data = await response.json();
    return {
      success: true,
      suggestions: data.choices[0].message.content
    };
  } catch (error) {
    console.error('Error getting event suggestions:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Main handler
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, eventContext } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Build system message with event context if available
    let systemMessage = `You are Planner AI, an intelligent event planning assistant. You help users plan events by:
- Finding and recommending venues
- Generating event details and ideas
- Creating planning checklists
- Providing creative suggestions and recommendations

You have access to several functions that allow you to search venues, get recommendations, generate events, create checklists, and provide suggestions. Use these functions when appropriate to help the user.

Be conversational, helpful, and proactive. When a user asks about venues, events, or planning, use the available functions to provide accurate and helpful information.`;

    if (eventContext) {
      systemMessage += `\n\nCurrent event context:
Title: ${eventContext.title || 'Not set'}
Date: ${eventContext.date || 'Not set'}
Location: ${eventContext.location || 'Not set'}
Description: ${eventContext.description || 'Not provided'}
Category: ${eventContext.category || 'Not set'}
Expected Attendees: ${eventContext.expected_attendees || 'Not specified'}`;
    }

    // Prepare messages for OpenAI
    const openAIMessages = [
      { role: 'system', content: systemMessage },
      ...messages
    ];

    // Initial API call
    let response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: openAIMessages,
        functions: functions,
        function_call: 'auto',
        temperature: 0.7
      }),
    });

    let data = await response.json();
    let assistantMessage = data.choices[0].message;

    // Handle function calls
    const functionCallHistory: any[] = [];
    let maxIterations = 5; // Prevent infinite loops
    let iteration = 0;

    while (assistantMessage.function_call && iteration < maxIterations) {
      iteration++;
      const functionName = assistantMessage.function_call.name;
      const functionArgs = JSON.parse(assistantMessage.function_call.arguments);

      console.log(`Calling function: ${functionName}`, functionArgs);

      // Add assistant message with function call to history
      openAIMessages.push(assistantMessage);
      functionCallHistory.push({ name: functionName, args: functionArgs });

      // Call the appropriate function
      let functionResult: any;
      switch (functionName) {
        case 'search_venues':
          functionResult = await handleSearchVenues(
            functionArgs.location,
            functionArgs.eventType,
            functionArgs.preferredFeatures
          );
          break;
        case 'get_venue_recommendations':
          functionResult = await handleGetVenueRecommendations(
            functionArgs.location,
            functionArgs.eventType,
            functionArgs.preferredFeatures
          );
          break;
        case 'generate_event':
          functionResult = await handleGenerateEvent(
            functionArgs.prompt,
            functionArgs.additionalInfo
          );
          break;
        case 'generate_checklist':
          functionResult = await handleGenerateChecklist(
            functionArgs.eventDetails
          );
          break;
        case 'get_event_suggestions':
          functionResult = await handleGetEventSuggestions(
            functionArgs.eventType,
            functionArgs.date,
            functionArgs.location,
            functionArgs.attendees
          );
          break;
        default:
          functionResult = { success: false, error: `Unknown function: ${functionName}` };
      }

      // Add function result to messages
      openAIMessages.push({
        role: 'function',
        name: functionName,
        content: JSON.stringify(functionResult)
      });

      // Get next response from OpenAI
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: openAIMessages,
          functions: functions,
          function_call: 'auto',
          temperature: 0.7
        }),
      });

      data = await response.json();
      assistantMessage = data.choices[0].message;
    }

    // Final response
    const finalResponse = assistantMessage.content || 'I apologize, but I encountered an issue processing your request.';

    return new Response(
      JSON.stringify({
        response: finalResponse,
        functionCalls: functionCallHistory.length > 0 ? functionCallHistory : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in planner-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

