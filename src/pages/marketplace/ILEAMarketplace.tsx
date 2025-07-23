
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
  const [selectedCity, setSelectedCity] = useState(""); 
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
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ILEAMarketplaceHeader />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Tab Navigation - Airbnb style */}
          <div className="mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-gray-100 rounded-xl p-1">
              <TabsTrigger 
                value="venues" 
                className="text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Venues ({venues?.length || 0})
              </TabsTrigger>
              <TabsTrigger 
                value="vendors" 
                className="text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Vendors ({vendors?.length || 0})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Filters Bar */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <ILEAFilters 
                selectedCity={selectedCity}
                onCityChange={handleCityChange}
                activeTab={activeTab}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </div>

          {/* Results Header */}
          <div className="mb-6">
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
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
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
        </Tabs>
      </div>
    </div>
  );
};

export default ILEAMarketplace;
