
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Define the vendor type to match our database structure
interface Vendor {
  name: string;
  description: string | null;
  price_range_start: number | null;
  price_range_end: number | null;
  company_id: string;
  city: string | null;
  zipcode: string | null;
}

interface ScrapedVendor {
  name: string;
  description?: string;
  price_range_start?: number;
  price_range_end?: number;
  services?: string[];
  location?: string;
  city?: string;
  zipcode?: string;
}

// Function to fetch vendor data from event vendor websites in Texas cities
async function scrapeTexasVendors(): Promise<ScrapedVendor[]> {
  console.log("Starting to scrape Texas vendors...");
  
  try {
    // In a production environment, you would use real web scraping here
    // For now, we're using enhanced sample data to simulate web scraping results
    // This would be replaced with actual scraping logic using libraries like Cheerio, Puppeteer, or services like Firecrawl
    
    const texasVendors: ScrapedVendor[] = [
      // Austin vendors
      {
        name: "Austin Event Lighting",
        description: "Professional lighting solutions for events of all sizes",
        price_range_start: 500,
        price_range_end: 5000,
        services: ["Lighting design", "Installation", "Audio-visual support"],
        city: "Austin",
        zipcode: "78701"
      },
      {
        name: "Capital Catering Co.",
        description: "Farm-to-table catering service specializing in local Austin cuisine",
        price_range_start: 25,
        price_range_end: 150,
        services: ["Full-service catering", "Buffet service", "Plated meals"],
        city: "Austin",
        zipcode: "78702"
      },
      {
        name: "Lone Star Photography",
        description: "Award-winning event photography capturing authentic moments",
        price_range_start: 1500,
        price_range_end: 8000,
        services: ["Event photography", "Photo booth", "Same-day edits"],
        city: "Austin",
        zipcode: "78704"
      },
      
      // Dallas vendors
      {
        name: "Dallas Elite Catering",
        description: "Premium catering services for corporate and social events",
        price_range_start: 35,
        price_range_end: 200,
        services: ["Corporate events", "Weddings", "Social gatherings"],
        city: "Dallas",
        zipcode: "75201"
      },
      {
        name: "North Texas Event Productions",
        description: "Full-service event production company",
        price_range_start: 2000,
        price_range_end: 15000,
        services: ["Event planning", "Audio-visual", "Stage design"],
        city: "Dallas",
        zipcode: "75202"
      },
      {
        name: "Dallas Wedding Films",
        description: "Cinematic wedding and event videography",
        price_range_start: 2500,
        price_range_end: 7500,
        services: ["Wedding films", "Event highlights", "Drone footage"],
        city: "Dallas",
        zipcode: "75219"
      },
      
      // Houston vendors
      {
        name: "Houston Sound & Lighting",
        description: "Professional audio and lighting services for any event",
        price_range_start: 800,
        price_range_end: 6000,
        services: ["Sound systems", "Stage lighting", "DJ services"],
        city: "Houston",
        zipcode: "77002"
      },
      {
        name: "Bayou City Caterers",
        description: "Houston's premier catering service featuring Gulf Coast cuisine",
        price_range_start: 30,
        price_range_end: 175,
        services: ["Corporate catering", "Wedding receptions", "Social events"],
        city: "Houston",
        zipcode: "77006"
      },
      {
        name: "Space City Event Rentals",
        description: "Complete event rental solutions from tables to tents",
        price_range_start: 500,
        price_range_end: 10000,
        services: ["Furniture rental", "Tent rental", "Decor packages"],
        city: "Houston",
        zipcode: "77007"
      },
      
      // San Antonio vendors
      {
        name: "Alamo City Bartenders",
        description: "Professional bartending services with Texas flair",
        price_range_start: 350,
        price_range_end: 1800,
        services: ["Bartending", "Custom cocktails", "Bar setup"],
        city: "San Antonio",
        zipcode: "78205"
      },
      {
        name: "River Walk Florists",
        description: "Beautiful floral designs for all occasions",
        price_range_start: 500,
        price_range_end: 5000,
        services: ["Wedding flowers", "Event decor", "Centerpieces"],
        city: "San Antonio",
        zipcode: "78205"
      },
      {
        name: "Mission Event Planning",
        description: "Full-service event planning with San Antonio charm",
        price_range_start: 2500,
        price_range_end: 15000,
        services: ["Wedding planning", "Corporate events", "Destination management"],
        city: "San Antonio",
        zipcode: "78215"
      }
    ];
    
    console.log(`Found ${texasVendors.length} vendors across Texas cities`);
    return texasVendors;
  } catch (error) {
    console.error("Error scraping vendors:", error);
    throw error;
  }
}

// Create a sample company if it doesn't exist
async function ensureVendorCompany(supabase): Promise<string> {
  const companyName = "Texas Vendors Collection";
  
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
      type: 'vendor',
      description: 'Collection of event vendors in Texas'
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
    
    console.log("Starting vendor scraping process for Texas cities...");
    
    // Scrape vendor data
    const vendorData = await scrapeTexasVendors();
    
    // Get or create a company for these vendors
    const companyId = await ensureVendorCompany(supabase);
    
    // Check if vendors already exist to avoid duplicates
    const { data: existingVendors } = await supabase
      .from('vendor_services')
      .select('name')
      .in('name', vendorData.map(vendor => vendor.name));
    
    const existingNames = new Set(existingVendors?.map(v => v.name) || []);
    
    // Format vendors for database insertion
    const vendorsToInsert = vendorData
      .filter(vendor => !existingNames.has(vendor.name))
      .map(vendor => ({
        name: vendor.name,
        description: vendor.description || null,
        price_range_start: vendor.price_range_start || null,
        price_range_end: vendor.price_range_end || null,
        city: vendor.city || null,
        zipcode: vendor.zipcode || null,
        company_id: companyId
      }));
    
    if (vendorsToInsert.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No new vendors to add',
          existing: existingNames.size 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Inserting ${vendorsToInsert.length} new vendors into database`);
    
    // Insert vendors
    const { data, error } = await supabase
      .from('vendor_services')
      .insert(vendorsToInsert)
      .select();
    
    if (error) {
      console.error('Error inserting vendors:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to insert vendors', details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        message: `Successfully added ${data.length} new vendors from Texas cities`,
        vendors: data.map(v => ({name: v.name, city: v.city}))
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
