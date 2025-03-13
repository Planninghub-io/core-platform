
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Compass, Sparkles, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type VendorService = {
  id: string;
  name: string;
  description: string | null;
  price_range_start: number | null;
  price_range_end: number | null;
  company_id: string;
  created_at: string;
};

const fetchVendorServices = async (): Promise<VendorService[]> => {
  const { data, error } = await supabase
    .from("vendor_services")
    .select("*");
  
  if (error) {
    console.error("Error fetching vendor services:", error);
    throw new Error("Failed to fetch vendor services");
  }
  
  return data || [];
};

const formatPrice = (price: number | null) => {
  if (price === null) return "";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const Vendors = () => {
  const [isScrapingVendors, setIsScrapingVendors] = useState(false);
  const { data: vendorServices, isLoading, error, refetch } = useQuery({
    queryKey: ["vendor_services"],
    queryFn: fetchVendorServices,
  });

  const handleScrapeVendors = async () => {
    setIsScrapingVendors(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You need to be logged in to use this feature");
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('scrape-vendors', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error("Error scraping vendors:", error);
        toast.error("Failed to scrape vendors. Please try again later.");
        return;
      }

      // Refetch vendor data to show the newly added vendors
      await refetch();
      
      if (data.vendors && data.vendors.length > 0) {
        toast.success(`Successfully added ${data.vendors.length} new vendors from Austin`);
      } else if (data.message.includes('No new vendors')) {
        toast.info("No new vendors found. All vendors are already in the database.");
      } else {
        toast.success(data.message);
      }
    } catch (err) {
      console.error("Error in scrape vendors process:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsScrapingVendors(false);
    }
  };

  return (
    <>
      <Tabs defaultValue="browse" className="mb-6">
        <TabsList>
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Compass className="h-4 w-4" />
            Browse Vendors
          </TabsTrigger>
          <TabsTrigger value="ai-agent" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Vendor AI Agent
          </TabsTrigger>
        </TabsList>
        <TabsContent value="browse" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading && (
              <div className="col-span-3 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b73f4]"></div>
              </div>
            )}

            {error && (
              <div className="col-span-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <p>Failed to load vendor services. Please try again later.</p>
              </div>
            )}

            {vendorServices && vendorServices.length === 0 && !isLoading && (
              <div className="col-span-3 text-center py-10">
                <h3 className="mt-2 text-lg font-medium text-gray-900">No vendor services found</h3>
                <p className="mt-1 text-gray-500">Check back later for available vendor services.</p>
              </div>
            )}

            {vendorServices?.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  {service.description && (
                    <CardDescription className="line-clamp-2">
                      {service.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {(service.price_range_start !== null || service.price_range_end !== null) && (
                    <div className="flex items-center text-gray-600 mb-4">
                      <DollarSign className="h-5 w-5 mr-2 text-[#8b73f4]" />
                      <span>
                        {service.price_range_start !== null && service.price_range_end !== null
                          ? `${formatPrice(service.price_range_start)} - ${formatPrice(service.price_range_end)}`
                          : service.price_range_start !== null
                          ? `From ${formatPrice(service.price_range_start)}`
                          : service.price_range_end !== null
                          ? `Up to ${formatPrice(service.price_range_end)}`
                          : "Price upon request"}
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 border-t flex justify-between">
                  <div className="text-sm text-gray-500">
                    Available for booking
                  </div>
                  <Button size="sm" className="bg-[#8b73f4] hover:bg-[#8b73f4]/90">
                    Contact Vendor
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="ai-agent" className="pt-4">
          <div className="bg-gradient-to-r from-violet-50/80 to-fuchsia-50/80 rounded-xl p-8 border border-purple-100">
            <div className="text-center mb-8">
              <h3 className="text-xl font-medium text-gray-900 mb-3">Vendor AI Discovery Agent</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI agent can search the web for event vendors in Austin and automatically add them to our database.
                This helps keep our marketplace up-to-date with the latest available vendors.
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 w-full max-w-md">
                <h4 className="font-medium text-lg mb-4 text-gray-800">Scrape Austin Vendors</h4>
                <p className="text-gray-600 mb-6">
                  Click the button below to scan for event vendors in Austin and add them to our database.
                </p>
                <Button 
                  onClick={handleScrapeVendors}
                  disabled={isScrapingVendors}
                  className="w-full bg-[#8b73f4] hover:bg-[#8b73f4]/90 text-white"
                >
                  {isScrapingVendors ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Scanning for Vendors...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Discover Austin Vendors
                    </>
                  )}
                </Button>
              </div>
              
              <div className="text-sm text-gray-500 italic max-w-md text-center">
                Note: This process uses an AI agent to search for vendors. Results are for demonstration purposes.
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Vendors;
