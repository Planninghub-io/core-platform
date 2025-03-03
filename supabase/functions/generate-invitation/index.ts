
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
    console.log('Using theme:', theme || 'elegant and professional');

    // Generate a template based on the theme
    let backgroundColor = '#f5f7fa';
    let gradientEnd = '#c3cfe2';
    let fontColor = '#333';
    let headerColor = '#333';
    let borderStyle = '';
    
    // Apply custom styles based on theme description
    if (theme) {
      const themeLower = theme.toLowerCase();
      
      if (themeLower.includes('elegant') || themeLower.includes('classic')) {
        backgroundColor = '#f9f7f5';
        gradientEnd = '#e5e0d5';
        fontColor = '#3a3a3a';
        headerColor = '#2c2c2c';
        borderStyle = 'border: 1px solid #d0c9c0;';
      } else if (themeLower.includes('modern') || themeLower.includes('minimalist')) {
        backgroundColor = '#ffffff';
        gradientEnd = '#f0f0f0';
        fontColor = '#2d2d2d';
        headerColor = '#1f1f1f';
      } else if (themeLower.includes('colorful') || themeLower.includes('vibrant')) {
        backgroundColor = '#ffd5e5';
        gradientEnd = '#82caff';
        fontColor = '#444';
        headerColor = '#333';
      } else if (themeLower.includes('dark') || themeLower.includes('night')) {
        backgroundColor = '#2c3e50';
        gradientEnd = '#1a1a2e';
        fontColor = '#ecf0f1';
        headerColor = '#ffffff';
      } else if (themeLower.includes('pastel')) {
        backgroundColor = '#E8F4F8';
        gradientEnd = '#FDDDE6';
        fontColor = '#5A5A5A';
        headerColor = '#4A4A4A';
      }
    }

    const template = `
      <div style="padding: 40px; min-height: 600px; display: flex; flex-direction: column; justify-content: center; align-items: center; color: ${fontColor}; text-align: center; font-family: 'Arial', sans-serif; background: linear-gradient(135deg, ${backgroundColor} 0%, ${gradientEnd} 100%); ${borderStyle}">
        <h1 style="font-size: 32px; margin-bottom: 20px; color: ${headerColor};">${eventDetails.title}</h1>
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
