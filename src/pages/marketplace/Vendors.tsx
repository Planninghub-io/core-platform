
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Compass, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const { data: vendorServices, isLoading, error } = useQuery({
    queryKey: ["vendor_services"],
    queryFn: fetchVendorServices,
  });

  return (
    <>
      <Tabs defaultValue="browse" className="mb-6">
        <TabsList>
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Compass className="h-4 w-4" />
            Browse Vendors
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Recommendations
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
        <TabsContent value="recommendations" className="pt-4">
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Vendor recommendations coming soon</h3>
            <p className="text-gray-600">
              We're working on AI-powered vendor recommendations to help you find the perfect services for your event.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Vendors;
