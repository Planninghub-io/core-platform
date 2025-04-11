
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Store, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VenuesList } from "@/components/venue-browser/VenuesList";
import { useVenues } from "@/hooks/useVenues";
import VenueFilters from "@/components/venue-filters/VenueFilters";

interface MarketplaceClient {
  id: string;
  name: string;
  slug: string;
  theme_colors?: {
    primary: string;
    secondary: string;
  };
  logo_url?: string;
}

interface PreferredVendor {
  id: string;
  name: string;
  description?: string;
  price_range_start?: number;
  price_range_end?: number;
  company?: {
    name: string;
    id: string;
  };
}

const ClientMarketplace = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [client, setClient] = useState<MarketplaceClient | null>(null);
  const [preferredVendors, setPreferredVendors] = useState<PreferredVendor[]>([]);
  const [activeTab, setActiveTab] = useState("venues");
  const [filters, setFilters] = useState({});
  const { venues, isLoading, error } = useVenues(filters);

  // Load client data when slug changes
  useEffect(() => {
    const fetchClientData = async () => {
      if (!slug) return;
      
      try {
        const { data, error } = await supabase.functions.invoke('marketplace-api', {
          body: { endpoint: 'client', client: slug }
        });
        
        if (error) {
          console.error("Error fetching client data:", error);
          toast({
            title: "Error",
            description: "Unable to load marketplace data",
            variant: "destructive",
          });
          return;
        }
        
        if (data.success && data.data) {
          setClient(data.data);
          document.title = `${data.data.name} Marketplace`;
          
          // Apply theme colors if available
          if (data.data.theme_colors) {
            document.documentElement.style.setProperty(
              '--marketplace-primary', 
              data.data.theme_colors.primary
            );
            document.documentElement.style.setProperty(
              '--marketplace-secondary', 
              data.data.theme_colors.secondary
            );
          }
        }
      } catch (err) {
        console.error("Failed to load marketplace:", err);
        toast({
          title: "Error",
          description: "Unable to load marketplace",
          variant: "destructive",
        });
      }
    };
    
    fetchClientData();
  }, [slug, toast]);

  // Fetch preferred vendors when client and tab change
  useEffect(() => {
    const fetchPreferredVendors = async () => {
      if (!client || activeTab !== "preferred") return;
      
      try {
        const { data, error } = await supabase.functions.invoke('marketplace-api', {
          body: { 
            endpoint: 'preferred-vendors', 
            client: client.slug 
          }
        });
        
        if (error) {
          console.error("Error fetching preferred vendors:", error);
          return;
        }
        
        if (data.success) {
          setPreferredVendors(data.data);
        }
      } catch (err) {
        console.error("Failed to load preferred vendors:", err);
      }
    };
    
    fetchPreferredVendors();
  }, [client, activeTab]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL without full page reload
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', value);
    navigate(
      { pathname: location.pathname, search: searchParams.toString() }, 
      { replace: true }
    );
  };
  
  // Styling based on client theme
  const headerStyle = {
    backgroundColor: client?.theme_colors?.secondary || "#f9f8ff",
    borderColor: client?.theme_colors?.primary || "#8b73f4",
  };
  
  const buttonStyle = {
    backgroundColor: client?.theme_colors?.primary || "#8b73f4",
    color: "white",
  };

  if (!client) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div 
        className="bg-opacity-80 p-6 mb-8 rounded-lg border-l-4" 
        style={headerStyle}
      >
        <div className="flex items-center mb-4">
          {client.logo_url && (
            <img 
              src={client.logo_url} 
              alt={`${client.name} logo`} 
              className="h-12 w-auto mr-4"
            />
          )}
          <h1 className="text-2xl md:text-3xl font-bold">
            {client.name} Marketplace
          </h1>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Find the perfect venues and vendors for your events in {client.name}.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="venues" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Venues
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="preferred" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Preferred Vendors
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="venues" className="pt-4">
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <VenueFilters onFilterChange={handleFilterChange} />
          </div>
          <VenuesList venues={venues} isLoading={isLoading} error={error} />
        </TabsContent>
        
        <TabsContent value="vendors" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This will be populated with vendor data */}
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-500">
                  Vendor listings will appear here.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="preferred" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preferredVendors.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No Preferred Vendors
                </h3>
                <p className="text-gray-500">
                  {client.name} has not added any preferred vendors yet.
                </p>
              </div>
            ) : (
              preferredVendors.map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{vendor.name}</h3>
                    {vendor.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">{vendor.description}</p>
                    )}
                    
                    {(vendor.price_range_start || vendor.price_range_end) && (
                      <p className="text-sm text-gray-500 mb-4">
                        Price Range: 
                        {vendor.price_range_start && vendor.price_range_end 
                          ? ` $${vendor.price_range_start} - $${vendor.price_range_end}`
                          : vendor.price_range_start
                            ? ` From $${vendor.price_range_start}`
                            : vendor.price_range_end
                              ? ` Up to $${vendor.price_range_end}`
                              : ' Contact for pricing'
                        }
                      </p>
                    )}
                    
                    <Button className="w-full" style={buttonStyle}>
                      Contact Vendor
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientMarketplace;
