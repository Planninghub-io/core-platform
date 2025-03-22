
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventDetails } = await req.json();
    
    // Extract relevant event details
    const { 
      title, 
      category, 
      date, 
      end_date, 
      location, 
      expected_attendees,
      budget
    } = eventDetails;

    const formattedDate = new Date(date).toLocaleDateString();
    const daysUntilEvent = Math.ceil(
      (new Date(date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );

    // Create prompt for OpenAI
    const prompt = `
      Generate a comprehensive checklist for a ${category || 'event'} titled "${title}" that will take place on ${formattedDate} at ${location || 'TBD'}.
      The event expects approximately ${expected_attendees || 'unknown number of'} attendees with a budget of ${budget ? '$' + budget : 'unspecified'}.
      
      The event is ${daysUntilEvent} days away. Create a timeline-based checklist with items organized by when they should be completed:
      - Immediately (tasks to do right now)
      - 1 month before
      - 2 weeks before
      - 1 week before
      - Day before
      - Day of event
      - Post-event
      
      For each timeline section, include 4-6 specific actionable checklist items relevant to the event category and scale.
      Format the response as a JSON array with the following structure:
      [
        {
          "timeline": "string", // e.g., "Immediately", "1 month before", etc.
          "items": [
            {
              "title": "string", // Task title
              "description": "string", // Brief task description
              "category": "string" // One of: "venue", "vendors", "guests", "logistics", "budget", "marketing", "other"
            }
          ]
        }
      ]`;

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert event planning assistant that creates detailed, practical checklists for events. Format your response exactly as specified in the user prompt."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const checklistContent = data.choices[0].message.content;
    
    // Parse the JSON from the response
    let checklist;
    try {
      // The response might be wrapped in code blocks or have extra text
      const jsonMatch = checklistContent.match(/```json\n([\s\S]*)\n```/) || 
                       checklistContent.match(/```\n([\s\S]*)\n```/) ||
                       [null, checklistContent];
      
      const jsonContent = jsonMatch[1] || checklistContent;
      checklist = JSON.parse(jsonContent);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.log("Raw content:", checklistContent);
      // If parsing fails, create a basic structure
      checklist = [
        {
          timeline: "Error",
          items: [{ 
            title: "Could not generate checklist", 
            description: "Please try again or create items manually", 
            category: "other" 
          }]
        }
      ];
    }

    return new Response(JSON.stringify({ checklist }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating checklist:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
