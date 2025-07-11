
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CitySelector } from "@/components/venue-filters/components/CitySelector";
import { ILEAMarketplaceHeader } from "@/components/marketplace/ilea/ILEAMarketplaceHeader";
import { ILEAVenuesTab } from "@/components/marketplace/ilea/ILEAVenuesTab";
import { ILEAVendorsTab } from "@/components/marketplace/ilea/ILEAVendorsTab";
import { useILEAVendors, useILEAVenues } from "@/hooks/useILEAData";

const ILEAMarketplace = () => {
  const [activeTab, setActiveTab] = useState("venues");
  const [selectedCity, setSelectedCity] = useState("Austin");

  const { data: vendors, isLoading: vendorsLoading, error: vendorsError } = useILEAVendors(selectedCity);
  const { data: venues, isLoading: venuesLoading, error: venuesError } = useILEAVenues(selectedCity);

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
