
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ILEAMarketplaceHeader } from "@/components/marketplace/ilea/ILEAMarketplaceHeader";
import { ILEAVenuesTab } from "@/components/marketplace/ilea/ILEAVenuesTab";
import { ILEAVendorsTab } from "@/components/marketplace/ilea/ILEAVendorsTab";
import { ILEAFilters } from "@/components/marketplace/ilea/ILEAFilters";
import { ILEAResultsHeader } from "@/components/marketplace/ilea/ILEAResultsHeader";
import { useILEAVendors, useILEAVenues } from "@/hooks/useILEAData";

const ILEAMarketplace = () => {
  const [activeTab, setActiveTab] = useState("venues");
  const [selectedCity, setSelectedCity] = useState(""); // Start with "all cities"
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: vendors, isLoading: vendorsLoading, error: vendorsError } = useILEAVendors(selectedCity);
  const { data: venues, isLoading: venuesLoading, error: venuesError } = useILEAVenues(selectedCity);

  const handleCityChange = (city: string) => {
    console.log("City changed to:", city);
    setSelectedCity(city);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const currentData = activeTab === "venues" ? venues : vendors;
  const isLoading = activeTab === "venues" ? venuesLoading : vendorsLoading;
  const error = activeTab === "venues" ? venuesError : vendorsError;

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <ILEAMarketplaceHeader />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-white rounded-lg border p-6 sticky top-6">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="venues" className="text-sm">
                    Venues ({venues?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="vendors" className="text-sm">
                    Vendors ({vendors?.length || 0})
                  </TabsTrigger>
                </TabsList>

                <ILEAFilters 
                  selectedCity={selectedCity}
                  onCityChange={handleCityChange}
                  activeTab={activeTab}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <ILEAResultsHeader
                activeTab={activeTab}
                selectedCity={selectedCity}
                resultCount={currentData?.length || 0}
                isLoading={isLoading}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              {/* Tab Content */}
              <div className="mt-6">
                <TabsContent value="venues" className="mt-0">
                  <ILEAVenuesTab 
                    venues={venues}
                    isLoading={venuesLoading}
                    error={venuesError}
                    selectedCity={selectedCity}
                    viewMode={viewMode}
                    sortBy={sortBy}
                  />
                </TabsContent>

                <TabsContent value="vendors" className="mt-0">
                  <ILEAVendorsTab 
                    vendors={vendors}
                    isLoading={vendorsLoading}
                    error={vendorsError}
                    selectedCity={selectedCity}
                    viewMode={viewMode}
                    sortBy={sortBy}
                  />
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ILEAMarketplace;
