
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
    const { eventDetails, theme } = await req.json();
    console.log('Generating invitation for event:', eventDetails, 'with theme:', theme);

    // Generate theme description for DALL-E
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
            content: "You are a creative designer specializing in event invitations."
          },
          {
            role: "user",
            content: `Create a detailed image prompt for an invitation design with this theme: ${theme || 'elegant and professional'}. 
            The event details are: ${JSON.stringify(eventDetails)}`
          }
        ],
      }),
    });

    const data = await response.json();
    const imagePrompt = data.choices[0].message.content;

    // Generate invitation background image using DALL-E
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024"
      })
    });

    const imageData = await imageResponse.json();
    const backgroundImage = imageData.data?.[0]?.url;

    return new Response(
      JSON.stringify({
        backgroundImage,
        theme: theme || 'elegant and professional',
        template: `
          <div style="background-image: url('${backgroundImage}'); background-size: cover; padding: 40px; min-height: 600px; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #333; text-align: center; font-family: 'Arial', sans-serif;">
            <h1 style="font-size: 32px; margin-bottom: 20px;">${eventDetails.title}</h1>
            <p style="font-size: 18px; margin-bottom: 15px;">You are cordially invited to</p>
            <p style="font-size: 24px; margin-bottom: 30px;">${eventDetails.description}</p>
            <div style="margin-bottom: 20px;">
              <p style="font-size: 20px;">Date & Time</p>
              <p style="font-size: 18px;">${new Date(eventDetails.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })}</p>
            </div>
            <div style="margin-bottom: 20px;">
              <p style="font-size: 20px;">Location</p>
              <p style="font-size: 18px;">${eventDetails.location}</p>
            </div>
          </div>
        `
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
