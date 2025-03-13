
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { format, addDays, parseISO } from 'https://esm.sh/date-fns@2.30.0';

// This function would typically connect to various venue calendars via their APIs
// For demonstration purposes, we'll generate fake availability data
async function scrapeVenueCalendars() {
  console.log("Starting to scrape venue calendars...");
  
  const venues = await getVenues();
  const updatedVenues = [];
  
  for (const venue of venues) {
    // Generate random unavailable dates for the next 60 days
    const unavailableDates = generateRandomUnavailableDates(60);
    
    // Update venue with new availability data
    const updatedVenue = await updateVenueAvailability(venue.id, unavailableDates);
    updatedVenues.push(updatedVenue);
  }
  
  return updatedVenues;
}

async function getVenues() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase
    .from('venues')
    .select('id, name');
    
  if (error) {
    console.error("Error fetching venues:", error);
    throw error;
  }
  
  return data || [];
}

function generateRandomUnavailableDates(daysAhead: number) {
  const unavailableDates = [];
  const today = new Date();
  
  // Make approximately 30% of the days unavailable
  for (let i = 0; i < daysAhead; i++) {
    if (Math.random() < 0.3) {
      const date = addDays(today, i);
      unavailableDates.push(format(date, 'yyyy-MM-dd'));
    }
  }
  
  return unavailableDates;
}

async function updateVenueAvailability(venueId: string, unavailableDates: string[]) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Update the venue with the new availability data
  const { data, error } = await supabase
    .from('venues')
    .update({
      availability: { dates: unavailableDates }
    })
    .eq('id', venueId)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating venue ${venueId} availability:`, error);
    throw error;
  }
  
  return data;
}

// Main handler for the Deno edge function
Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Extract auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Starting venue calendar scraping process...");
    
    // Scrape venue calendars and update venue availability
    const updatedVenues = await scrapeVenueCalendars();
    
    return new Response(
      JSON.stringify({ 
        message: `Successfully updated availability for ${updatedVenues.length} venues`,
        venues: updatedVenues.map(v => v.name)
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
