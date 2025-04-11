
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Configure CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (req) => {
  // Handle OPTIONS (preflight) requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Skip 'marketplace-api' in path
    const endpoint = pathParts.length > 1 ? pathParts[1] : null;
    const clientSlug = url.searchParams.get('client') || 'visitkileen'; // Default to VisitKileen if not specified

    // Get the marketplace client
    const { data: client, error: clientError } = await supabase
      .from('marketplace_clients')
      .select('id, name, slug, theme_colors, logo_url')
      .eq('slug', clientSlug)
      .single();

    if (clientError || !client) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Marketplace not found: ${clientSlug}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Process different API endpoints
    switch (endpoint) {
      case 'venues':
        return await handleVenues(req, client, corsHeaders);
      
      case 'vendors':
        return await handleVendors(req, client, corsHeaders);
      
      case 'preferred-venues':
        return await handlePreferredVenues(req, client, corsHeaders);
      
      case 'preferred-vendors':
        return await handlePreferredVendors(req, client, corsHeaders);
      
      case 'client':
        // Return client information
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: client
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      
      default:
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid endpoint',
            available_endpoints: ['venues', 'vendors', 'preferred-venues', 'preferred-vendors', 'client']
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
  } catch (error) {
    console.error('Marketplace API error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Handler for venues endpoint
async function handleVenues(req: Request, client: any, corsHeaders: Record<string, string>) {
  const url = new URL(req.url);
  
  // Parse query parameters for filtering
  const city = url.searchParams.get('city');
  const minCapacity = url.searchParams.get('minCapacity') ? parseInt(url.searchParams.get('minCapacity')!) : null;
  const maxCapacity = url.searchParams.get('maxCapacity') ? parseInt(url.searchParams.get('maxCapacity')!) : null;
  const date = url.searchParams.get('date');
  
  // Start building query
  let query = supabase
    .from('venues')
    .select(`
      id,
      name,
      location,
      city,
      capacity,
      indoor_space_sqft,
      outdoor_space_sqft,
      booking_policy,
      cancellation_policy,
      amenities,
      availability,
      companies (name, id)
    `);
  
  // Apply filters if provided
  if (city) query = query.ilike('city', `%${city}%`);
  if (minCapacity) query = query.gte('capacity', minCapacity);
  if (maxCapacity) query = query.lte('capacity', maxCapacity);
  
  // Execute the query
  const { data: venues, error } = await query;
  
  // Filter by date availability if requested
  let filteredVenues = venues;
  if (date && venues) {
    filteredVenues = venues.filter(venue => {
      // Simple availability check (could be more sophisticated)
      if (!venue.availability || !venue.availability.dates) return true;
      return !venue.availability.dates.includes(date);
    });
  }
  
  if (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
  
  return new Response(
    JSON.stringify({ success: true, data: filteredVenues || [] }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  );
}

// Handler for vendors endpoint
async function handleVendors(req: Request, client: any, corsHeaders: Record<string, string>) {
  const url = new URL(req.url);
  
  // Parse filter parameters
  const name = url.searchParams.get('name');
  const minPrice = url.searchParams.get('minPrice') ? parseInt(url.searchParams.get('minPrice')!) : null;
  const maxPrice = url.searchParams.get('maxPrice') ? parseInt(url.searchParams.get('maxPrice')!) : null;
  
  // Start building query
  let query = supabase
    .from('vendor_services')
    .select(`
      id,
      name,
      description,
      price_range_start,
      price_range_end,
      companies (name, id)
    `);
  
  // Apply filters if provided
  if (name) query = query.ilike('name', `%${name}%`);
  if (minPrice) query = query.gte('price_range_start', minPrice);
  if (maxPrice) query = query.lte('price_range_end', maxPrice);
  
  const { data: vendors, error } = await query;
  
  if (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
  
  return new Response(
    JSON.stringify({ success: true, data: vendors || [] }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  );
}

// Handler for preferred venues endpoint
async function handlePreferredVenues(req: Request, client: any, corsHeaders: Record<string, string>) {
  const { data: preferredVenues, error } = await supabase
    .from('marketplace_preferred_venues')
    .select(`
      id,
      display_order,
      venues (
        id,
        name,
        location,
        city,
        capacity,
        indoor_space_sqft,
        outdoor_space_sqft,
        booking_policy,
        cancellation_policy,
        amenities,
        availability,
        companies (name, id)
      )
    `)
    .eq('marketplace_client_id', client.id)
    .order('display_order');
  
  if (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
  
  // Extract venue objects from join table results
  const venues = preferredVenues?.map(pv => pv.venues) || [];
  
  return new Response(
    JSON.stringify({ success: true, data: venues }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  );
}

// Handler for preferred vendors endpoint
async function handlePreferredVendors(req: Request, client: any, corsHeaders: Record<string, string>) {
  const { data: preferredVendors, error } = await supabase
    .from('marketplace_preferred_vendors')
    .select(`
      id,
      display_order,
      vendor_services (
        id,
        name,
        description,
        price_range_start,
        price_range_end,
        companies (name, id)
      )
    `)
    .eq('marketplace_client_id', client.id)
    .order('display_order');
  
  if (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
  
  // Extract vendor objects from join table results
  const vendors = preferredVendors?.map(pv => pv.vendor_services) || [];
  
  return new Response(
    JSON.stringify({ success: true, data: vendors }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  );
}
