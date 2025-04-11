
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

// Function to fetch vendor data from event vendor websites in Austin, TX
async function scrapeAustinVendors(): Promise<ScrapedVendor[]> {
  console.log("Starting to scrape Austin vendors...");
  
  try {
    // In a production environment, you would use real web scraping here
    // For now, we're using enhanced sample data to simulate web scraping results
    // This would be replaced with actual scraping logic using libraries like Cheerio, Puppeteer, or services like Firecrawl
    
    const austinVendors: ScrapedVendor[] = [
      {
        name: "Austin Event Lighting",
        description: "Professional lighting solutions for events of all sizes",
        price_range_start: 500,
        price_range_end: 5000,
        services: ["Lighting design", "Installation", "Audio-visual support"],
        location: "Austin",
        city: "Austin",
        zipcode: "78701"
      },
      {
        name: "Capital Catering Co.",
        description: "Farm-to-table catering service specializing in local Austin cuisine",
        price_range_start: 25,
        price_range_end: 150,
        services: ["Full-service catering", "Buffet service", "Plated meals"],
        location: "Austin",
        city: "Austin",
        zipcode: "78702"
      },
      {
        name: "Lone Star Photography",
        description: "Award-winning event photography capturing authentic moments",
        price_range_start: 1500,
        price_range_end: 8000,
        services: ["Event photography", "Photo booth", "Same-day edits"],
        location: "Austin",
        city: "Austin",
        zipcode: "78704"
      },
      {
        name: "ATX DJ Collective",
        description: "Experienced DJs for weddings, corporate events, and private parties",
        price_range_start: 800,
        price_range_end: 3000,
        services: ["DJ services", "Sound equipment", "Custom playlists"],
        location: "Austin",
        city: "Austin",
        zipcode: "78701"
      },
      {
        name: "Wildflower Event Florists",
        description: "Bespoke floral designs featuring Texas wildflowers and sustainable practices",
        price_range_start: 1000,
        price_range_end: 10000,
        services: ["Floral arrangements", "Installation", "Consultation"],
        location: "Austin",
        city: "Austin",
        zipcode: "78703"
      },
      {
        name: "Austin Vintage Rentals",
        description: "Curated collection of vintage furniture and decor for unique event styling",
        price_range_start: 500,
        price_range_end: 7500,
        services: ["Furniture rental", "Styling", "Delivery and setup"],
        location: "Austin",
        city: "Austin",
        zipcode: "78704"
      },
      {
        name: "Live Oak Videography",
        description: "Cinematic event videography with a storytelling approach",
        price_range_start: 2500,
        price_range_end: 12000,
        services: ["Event videography", "Drone footage", "Highlight reels"],
        location: "Austin",
        city: "Austin",
        zipcode: "78704"
      },
      {
        name: "Texas Hill Country Events",
        description: "Full-service event planning and coordination",
        price_range_start: 3000,
        price_range_end: 15000,
        services: ["Event planning", "Day-of coordination", "Venue selection"],
        location: "Austin",
        city: "Austin",
        zipcode: "78705"
      },
      {
        name: "Austin Sound & Stage",
        description: "Professional sound and staging for events and performances",
        price_range_start: 1000,
        price_range_end: 8000,
        services: ["Sound engineering", "Stage setup", "Equipment rental"],
        location: "Austin",
        city: "Austin",
        zipcode: "78701"
      },
      {
        name: "Capital City Bartenders",
        description: "Professional bartending services with craft cocktail expertise",
        price_range_start: 500,
        price_range_end: 2500,
        services: ["Bartending", "Custom cocktail menus", "Bar setup"],
        location: "Austin",
        city: "Austin",
        zipcode: "78701"
      },
      {
        name: "ATX Event Staffing",
        description: "Professional event staff including servers, greeters, and security",
        price_range_start: 25,
        price_range_end: 45,
        services: ["Event staffing", "Server training", "On-site management"],
        location: "Austin",
        city: "Austin",
        zipcode: "78702"
      },
      {
        name: "Austin Wedding Officiants",
        description: "Professional officiants for weddings and commitment ceremonies",
        price_range_start: 350,
        price_range_end: 1200,
        services: ["Ceremony planning", "Officiating", "Custom vows"],
        location: "Austin",
        city: "Austin",
        zipcode: "78705"
      },
      // Add vendors in San Antonio
      {
        name: "San Antonio Sound Productions",
        description: "High-quality audio and visual services for events and concerts",
        price_range_start: 600,
        price_range_end: 6000,
        city: "San Antonio",
        zipcode: "78205"
      },
      {
        name: "Alamo City Catering",
        description: "Authentic Tex-Mex catering for all types of events",
        price_range_start: 20,
        price_range_end: 120,
        city: "San Antonio",
        zipcode: "78210"
      },
      // Add vendors in Dallas
      {
        name: "Dallas Decor & Design",
        description: "Luxury event decoration and design services",
        price_range_start: 2000,
        price_range_end: 20000,
        city: "Dallas",
        zipcode: "75201"
      },
      {
        name: "North Texas Photo Booths",
        description: "Fun and interactive photo booth rentals",
        price_range_start: 400,
        price_range_end: 1800,
        city: "Dallas",
        zipcode: "75202"
      }
    ];
    
    console.log(`Found ${austinVendors.length} vendors in multiple cities`);
    return austinVendors;
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
    
    console.log("Starting vendor scraping process...");
    
    // Scrape vendor data
    const vendorData = await scrapeAustinVendors();
    
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
        message: `Successfully added ${data.length} new vendors from multiple cities`,
        vendors: data.map(v => v.name)
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
