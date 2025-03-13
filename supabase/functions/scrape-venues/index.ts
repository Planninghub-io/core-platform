
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { scrapeAustinVenues } from "./venueScrapers.ts";
import { ensureVenueCompany, prepareVenuesForInsertion, insertVenues } from "./dbOperations.ts";

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
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log("Starting venue scraping process...");
    
    // Scrape venue data
    const venueData = await scrapeAustinVenues();
    
    // Get or create a company for these venues
    const companyId = await ensureVenueCompany(supabase);
    
    // Prepare venues for insertion
    const venuesToInsert = await prepareVenuesForInsertion(supabase, venueData, companyId);
    
    if (venuesToInsert.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No new venues to add',
          existing: venueData.length - venuesToInsert.length 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Inserting ${venuesToInsert.length} new venues into database`);
    
    // Insert venues
    const insertedVenues = await insertVenues(supabase, venuesToInsert);
    
    return new Response(
      JSON.stringify({ 
        message: `Successfully added ${insertedVenues.length} new venues from Austin, Texas`,
        venues: insertedVenues.map(v => v.name)
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
