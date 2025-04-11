
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Venue, ScrapedVenue } from "./types.ts";

// Create a sample company if it doesn't exist
export async function ensureVenueCompany(supabase): Promise<string> {
  const companyName = "Texas Venues Collection";
  
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
      description: 'Collection of venues across Texas'
    })
    .select('id')
    .single();
  
  if (error) {
    console.error('Error creating company:', error);
    throw error;
  }
  
  return newCompany.id;
}

// Check for existing venues and format new ones for insertion
export async function prepareVenuesForInsertion(
  supabase, 
  venueData: ScrapedVenue[], 
  companyId: string
): Promise<Venue[]> {
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
      company_id: companyId,
      city: venue.city,
      zipcode: venue.zipcode || null
    }));
    
  return venuesToInsert;
}

// Insert venues into the database
export async function insertVenues(supabase, venues: Venue[]) {
  const { data, error } = await supabase
    .from('venues')
    .insert(venues)
    .select();
  
  if (error) {
    console.error('Error inserting venues:', error);
    throw error;
  }
  
  return data;
}
