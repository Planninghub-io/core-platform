
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CitySelector } from "@/components/venue-filters/components/CitySelector";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ILEAMarketplaceHeader } from "@/components/marketplace/ilea/ILEAMarketplaceHeader";
import { ILEAVenuesTab } from "@/components/marketplace/ilea/ILEAVenuesTab";
import { ILEAVendorsTab } from "@/components/marketplace/ilea/ILEAVendorsTab";

interface ILEAVendor {
  id: string;
  name: string;
  description?: string;
  city?: string;
  zipcode?: string;
  price_range_start?: number;
  price_range_end?: number;
  company?: {
    name: string;
    id: string;
    business_email?: string;
    business_phone?: string;
    website_url?: string;
  };
}

interface ILEAVenue {
  id: string;
  name: string;
  location?: string;
  city?: string;
  zipcode?: string;
  capacity?: number;
  amenities?: any;
  company?: {
    name: string;
    id: string;
    business_email?: string;
    business_phone?: string;
    website_url?: string;
    address?: string;
  };
}

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
  
  if (city) {
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
      companies (
        name,
        id,
        business_email,
        business_phone,
        website_url,
        address
      )
    `);
  
  if (city) {
    query = query.eq("city", city);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching ILEA venues:", error);
    throw new Error("Failed to fetch venues");
  }
  
  console.log("Fetched venues data:", data);
  
  // Transform the data to match our interface
  const transformedData = (data || []).map(item => ({
    ...item,
    company: Array.isArray(item.companies) ? item.companies[0] : item.companies
  }));
  
  return transformedData;
};

const ILEAMarketplace = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("venues");
  const [selectedCity, setSelectedCity] = useState("Austin");

  const { data: vendors, isLoading: vendorsLoading, error: vendorsError } = useQuery({
    queryKey: ["ilea_vendors", selectedCity],
    queryFn: () => fetchILEAVendors(selectedCity),
    retry: 2,
  });

  const { data: venues, isLoading: venuesLoading, error: venuesError } = useQuery({
    queryKey: ["ilea_venues", selectedCity],
    queryFn: () => fetchILEAVenues(selectedCity),
    retry: 2,
  });

  const handleCityChange = (city: string) => {
    console.log("City changed to:", city);
    setSelectedCity(city);
  };

  console.log("ILEAMarketplace render:", {
    activeTab,
    selectedCity,
    venues: venues?.length || 0,
    vendors: vendors?.length || 0,
    venuesLoading,
    vendorsLoading,
    venuesError,
    vendorsError
  });

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <ILEAMarketplaceHeader />

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-purple-50 border border-purple-200">
          <TabsTrigger value="venues" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            ILEA Venues ({venues?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            ILEA Vendors ({vendors?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* City Filter */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
          <div className="max-w-xs">
            <CitySelector 
              selectedCity={selectedCity} 
              onCitySelect={handleCityChange}
              type={activeTab === "vendors" ? "vendors" : "venues"}
            />
          </div>
        </div>

        {/* Venues Tab */}
        <TabsContent value="venues" className="pt-4">
          <ILEAVenuesTab 
            venues={venues}
            isLoading={venuesLoading}
            error={venuesError}
            selectedCity={selectedCity}
          />
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="pt-4">
          <ILEAVendorsTab 
            vendors={vendors}
            isLoading={vendorsLoading}
            error={vendorsError}
            selectedCity={selectedCity}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ILEAMarketplace;
