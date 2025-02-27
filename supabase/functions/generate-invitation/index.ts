
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
    console.log('Generating invitation for event:', eventDetails);

    // Generate a basic template without DALL-E for now (we can add it back later once the basic flow works)
    const template = `
      <div style="padding: 40px; min-height: 600px; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #333; text-align: center; font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
        <h1 style="font-size: 32px; margin-bottom: 20px;">${eventDetails.title}</h1>
        <p style="font-size: 18px; margin-bottom: 15px;">You are cordially invited to</p>
        <p style="font-size: 24px; margin-bottom: 30px;">${eventDetails.description || 'Join us for this special event'}</p>
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
          <p style="font-size: 18px;">${eventDetails.location || 'Location to be announced'}</p>
        </div>
      </div>
    `;

    return new Response(
      JSON.stringify({
        theme: theme || 'elegant and professional',
        template: template
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
