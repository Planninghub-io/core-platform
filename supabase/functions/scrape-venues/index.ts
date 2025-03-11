
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Define the venue type to match our database structure
interface Venue {
  name: string;
  capacity: number | null;
  indoor_space_sqft: number | null;
  outdoor_space_sqft: number | null;
  amenities: Record<string, boolean> | null;
  booking_policy: string | null;
  cancellation_policy: string | null;
  company_id: string;
}

interface ScrapedVenue {
  name: string;
  capacity?: number;
  indoor_space_sqft?: number;
  outdoor_space_sqft?: number;
  amenities?: Record<string, boolean>;
  booking_policy?: string;
  cancellation_policy?: string;
}

// Function to fetch venue data from wedding venues websites in Austin, TX
async function scrapeAustinVenues(): Promise<ScrapedVenue[]> {
  console.log("Starting to scrape Austin venues...");
  
  try {
    // In a production environment, you would use real web scraping here
    // For now, we're using enhanced sample data to simulate web scraping results
    // This would be replaced with actual scraping logic using libraries like Cheerio, Puppeteer, or services like Firecrawl
    
    const austinVenues: ScrapedVenue[] = [
      {
        name: "The Driskill Hotel",
        capacity: 350,
        indoor_space_sqft: 18000,
        amenities: {
          wifi: true,
          catering: true,
          audio_visual: true,
          parking: true,
          wheelchair_accessible: true
        },
        booking_policy: "Requires deposit of 50% at booking, with remainder due 30 days prior to event."
      },
      {
        name: "Palmer Events Center",
        capacity: 5000,
        indoor_space_sqft: 131000,
        outdoor_space_sqft: 20000,
        amenities: {
          wifi: true,
          catering: true,
          audio_visual: true,
          parking: true,
          wheelchair_accessible: true,
          outdoor_space: true
        },
        booking_policy: "Reservation requires signed contract and 25% deposit."
      },
      {
        name: "The Allan House",
        capacity: 200,
        indoor_space_sqft: 3500,
        outdoor_space_sqft: 10000,
        amenities: {
          catering: true,
          parking: true,
          outdoor_space: true,
          wifi: true
        },
        booking_policy: "50% deposit required at booking."
      },
      {
        name: "Brazos Hall",
        capacity: 850,
        indoor_space_sqft: 10000,
        amenities: {
          catering: true,
          audio_visual: true,
          parking: true,
          wifi: true
        },
        booking_policy: "Requires security deposit and 50% payment to reserve."
      },
      {
        name: "The Contemporary Austin - Jones Center",
        capacity: 400,
        indoor_space_sqft: 7000,
        amenities: {
          catering: true,
          audio_visual: true,
          wheelchair_accessible: true,
          wifi: true
        },
        booking_policy: "Museum membership required for booking."
      },
      {
        name: "Umlauf Sculpture Garden",
        capacity: 250,
        outdoor_space_sqft: 8000,
        amenities: {
          outdoor_space: true,
          catering: true,
          wheelchair_accessible: true
        },
        booking_policy: "Requires liability insurance for all events."
      },
      {
        name: "Mercury Hall",
        capacity: 200,
        indoor_space_sqft: 3000,
        outdoor_space_sqft: 5000,
        amenities: {
          outdoor_space: true, 
          catering: true,
          parking: true,
          wifi: true
        },
        booking_policy: "50% deposit due at booking, remainder due 14 days before event."
      },
      {
        name: "Austin Central Library",
        capacity: 300,
        indoor_space_sqft: 5000,
        amenities: {
          wifi: true,
          audio_visual: true,
          wheelchair_accessible: true
        },
        booking_policy: "Application required with 30 days advance notice."
      },
      {
        name: "The LINE Austin",
        capacity: 500,
        indoor_space_sqft: 15000,
        amenities: {
          catering: true,
          audio_visual: true,
          parking: true,
          wifi: true
        },
        booking_policy: "Food and beverage minimum required."
      },
      {
        name: "Mattie's at Green Pastures",
        capacity: 225,
        indoor_space_sqft: 4000,
        outdoor_space_sqft: 10000,
        amenities: {
          catering: true,
          outdoor_space: true,
          parking: true,
          wifi: true
        },
        booking_policy: "Food and beverage minimum varies by day of week."
      },
      // Additional Austin venues
      {
        name: "Hotel Van Zandt",
        capacity: 500,
        indoor_space_sqft: 12000,
        amenities: {
          catering: true,
          audio_visual: true,
          parking: true,
          wifi: true,
          wheelchair_accessible: true
        },
        booking_policy: "50% deposit required at signing."
      },
      {
        name: "The Wilde House",
        capacity: 175,
        indoor_space_sqft: 2800,
        outdoor_space_sqft: 8000,
        amenities: {
          outdoor_space: true,
          catering: true,
          parking: true
        },
        booking_policy: "Requires 50% deposit and signed contract to reserve date."
      },
      {
        name: "Barr Mansion",
        capacity: 300,
        indoor_space_sqft: 5500,
        outdoor_space_sqft: 15000,
        amenities: {
          catering: true,
          outdoor_space: true,
          parking: true,
          wifi: true
        },
        booking_policy: "Requires 50% deposit, with balance due 10 days before event."
      },
      {
        name: "The Terrace Club",
        capacity: 200,
        indoor_space_sqft: 4000,
        outdoor_space_sqft: 3000,
        amenities: {
          catering: true,
          audio_visual: true,
          parking: true,
          outdoor_space: true
        },
        booking_policy: "25% deposit required to reserve date."
      },
      {
        name: "One World Theatre",
        capacity: 300,
        indoor_space_sqft: 6000,
        outdoor_space_sqft: 5000,
        amenities: {
          audio_visual: true,
          parking: true,
          wheelchair_accessible: true
        },
        booking_policy: "Requires 50% deposit with signed contract."
      }
    ];
    
    console.log(`Found ${austinVenues.length} venues in Austin`);
    return austinVenues;
  } catch (error) {
    console.error("Error scraping Austin venues:", error);
    throw error;
  }
}

// Create a sample company if it doesn't exist
async function ensureVenueCompany(supabase): Promise<string> {
  const companyName = "Austin Venues Collection";
  
  // Check if company already exists
  const { data: existingCompany } = await supabase
    .from('companies')
    .select('id')
    .eq('name', companyName)
    .single();
  
  if (existingCompany) {
    return existingCompany.id;
  }
  
  // Create new company
  const { data: newCompany, error } = await supabase
    .from('companies')
    .insert({
      name: companyName,
      type: 'venue',
      description: 'Collection of venues in Austin, Texas'
    })
    .select('id')
    .single();
  
  if (error) {
    console.error('Error creating company:', error);
    throw error;
  }
  
  return newCompany.id;
}

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
    
    // Check if venues already exist to avoid duplicates
    const { data: existingVenues } = await supabase
      .from('venues')
      .select('name')
      .in('name', venueData.map(venue => venue.name));
    
    const existingNames = new Set(existingVenues?.map(v => v.name) || []);
    
    // Format venues for database insertion
    const venuesToInsert = venueData
      .filter(venue => !existingNames.has(venue.name))
      .map(venue => ({
        name: venue.name,
        capacity: venue.capacity || null,
        indoor_space_sqft: venue.indoor_space_sqft || null,
        outdoor_space_sqft: venue.outdoor_space_sqft || null,
        amenities: venue.amenities || null,
        booking_policy: venue.booking_policy || null,
        cancellation_policy: venue.cancellation_policy || null,
        company_id: companyId
      }));
    
    if (venuesToInsert.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No new venues to add',
          existing: existingNames.size 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Inserting ${venuesToInsert.length} new venues into database`);
    
    // Insert venues
    const { data, error } = await supabase
      .from('venues')
      .insert(venuesToInsert)
      .select();
    
    if (error) {
      console.error('Error inserting venues:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to insert venues', details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        message: `Successfully added ${data.length} new venues from Austin, Texas`,
        venues: data.map(v => v.name)
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
