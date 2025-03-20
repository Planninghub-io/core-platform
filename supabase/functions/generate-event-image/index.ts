
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // Call DALL-E API to generate image
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`Failed to generate image: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const image_url = data.data[0].url;
    
    console.log("Generated image URL:", image_url);
    
    // Fetch the image to store it in Supabase storage
    const imageResponse = await fetch(image_url);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch generated image');
    }
    
    const imageBlob = await imageResponse.blob();
    
    // Create Supabase client with admin privileges to upload to storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create a unique filename for the image
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `event_${timestamp}_${randomString}.png`;
    
    // Upload the image to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('event-images')
      .upload(filename, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      // If bucket doesn't exist, fall back to returning the original URL
      console.log('Falling back to returning the original OpenAI URL');
      return new Response(
        JSON.stringify({ image_url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    
    // Get the public URL for the uploaded image
    const { data: publicUrlData } = supabase
      .storage
      .from('event-images')
      .getPublicUrl(filename);
    
    const permanentImageUrl = publicUrlData.publicUrl;
    console.log("Permanent image URL stored:", permanentImageUrl);

    return new Response(
      JSON.stringify({ image_url: permanentImageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
