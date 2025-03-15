
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract request body
    const requestData = await req.json();
    const { 
      eventDetails, 
      requestDetails, 
      selectedVenueIds, 
      userId 
    } = requestData;
    
    if (!eventDetails || !requestDetails || !selectedVenueIds || selectedVenueIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Creating RFP for ${selectedVenueIds.length} venues`);

    // Create the main RFP record
    const { data: rfpData, error: rfpError } = await supabase
      .from('venue_rfps')
      .insert({
        user_id: userId,
        event_name: eventDetails.name,
        event_type: eventDetails.type,
        event_date: eventDetails.date,
        guest_count: eventDetails.guestCount,
        budget: eventDetails.budget,
        special_requirements: requestDetails.specialRequirements,
        status: 'pending'
      })
      .select()
      .single();

    if (rfpError) {
      console.error('Error creating RFP:', rfpError);
      return new Response(
        JSON.stringify({ error: 'Failed to create RFP', details: rfpError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create venue request records for each selected venue
    const venueRequests = selectedVenueIds.map(venueId => ({
      rfp_id: rfpData.id,
      venue_id: venueId,
      status: 'pending'
    }));

    const { data: venueRequestData, error: venueRequestError } = await supabase
      .from('venue_rfp_requests')
      .insert(venueRequests)
      .select();

    if (venueRequestError) {
      console.error('Error creating venue requests:', venueRequestError);
      return new Response(
        JSON.stringify({ error: 'Failed to create venue requests', details: venueRequestError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        rfp: rfpData, 
        requests: venueRequestData,
        message: `RFP created successfully for ${selectedVenueIds.length} venues`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
