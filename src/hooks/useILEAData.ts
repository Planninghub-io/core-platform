
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ILEAVendor, ILEAVenue } from "@/types/ilea";

const fetchILEAVendors = async (city: string = ""): Promise<ILEAVendor[]> => {
  console.log("Fetching ILEA vendors for city:", city);
  
  let query = supabase
    .from("vendor_services")
    .select(`
      id,
      name,
      description,
      city,
      zipcode,
      price_range_start,
      price_range_end,
      company_id,
      companies (
        name,
        id,
        business_email,
        business_phone,
        website_url
      )
    `);
  
  if (city && city !== "") {
    query = query.eq("city", city);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching ILEA vendors:", error);
    throw new Error("Failed to fetch vendors");
  }
  
  console.log("Fetched vendors data:", data);
  
  // Transform the data to match our interface
  const transformedData = (data || []).map(item => ({
    ...item,
    company: Array.isArray(item.companies) ? item.companies[0] : item.companies
  }));
  
  return transformedData;
};

const fetchILEAVenues = async (city: string = ""): Promise<ILEAVenue[]> => {
  console.log("Fetching ILEA venues for city:", city);
  
  try {
    let query = supabase
      .from("venues")
      .select(`
        id,
        name,
        location,
        city,
        zipcode,
        capacity,
        amenities,
        company_id,
        companies!inner (
          name,
          id,
          business_email,
          business_phone,
          website_url,
          address
        )
      `);
    
    if (city && city !== "") {
      query = query.eq("city", city);
    }
    
    console.log("About to execute venues query for city:", city);
    const { data, error } = await query;
    
    console.log("Venues query result:", { data, error, count: data?.length });
    
    if (error) {
      console.error("Error fetching ILEA venues:", error);
      throw new Error(`Failed to fetch venues: ${error.message}`);
    }
    
    console.log("Raw venues data before transformation:", data);
    
    // Transform the data to match our interface
    const transformedData = (data || []).map(item => {
      console.log("Transforming venue item:", item);
      return {
        ...item,
        company: Array.isArray(item.companies) ? item.companies[0] : item.companies
      };
    });
    
    console.log("Final transformed venues data:", transformedData);
    return transformedData;
  } catch (err) {
    console.error("Exception in fetchILEAVenues:", err);
    throw err;
  }
};

export const useILEAVendors = (selectedCity: string) => {
  return useQuery({
    queryKey: ["ilea_vendors", selectedCity],
    queryFn: () => fetchILEAVendors(selectedCity),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useILEAVenues = (selectedCity: string) => {
  return useQuery({
    queryKey: ["ilea_venues", selectedCity],
    queryFn: () => fetchILEAVenues(selectedCity),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
