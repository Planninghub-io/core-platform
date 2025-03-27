
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, eventContext } = await req.json();
    return await getOpenAIResponse(question, eventContext);
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function getOpenAIResponse(question, eventContext) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant helping users with questions about an event. 
          Here are the event details:
          Title: ${eventContext.title}
          Date: ${eventContext.date}
          End Date: ${eventContext.end_date}
          Description: ${eventContext.description || 'Not provided'}
          Location: ${eventContext.location || 'Not provided'}
          Category: ${eventContext.category || 'Not provided'}
          Expected Attendees: ${eventContext.expected_attendees || 'Not specified'}
          
          Provide helpful, concise answers based on this information. If you can't answer something based on the available information, say so.`
        },
        {
          role: 'user',
          content: question
        }
      ],
    }),
  });

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;

  return new Response(
    JSON.stringify({ response: aiResponse }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
