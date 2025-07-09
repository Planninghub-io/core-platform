
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Store, Star, Users, MapPin, Phone, Mail, Globe, ExternalLink, Heart, Calendar, Bookmark } from "lucide-react";
import { CitySelector } from "@/components/venue-filters/components/CitySelector";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

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
  
  return data || [];
};

const fetchILEAVenues = async (city: string = ""): Promise<ILEAVenue[]> => {
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

const formatVenueType = (type: string) => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const VendorCard = ({ vendor }: { vendor: ILEAVendor }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border border-purple-100 hover:border-purple-300 bg-white">
      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs font-medium">
                ILEA Certified
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-1">
              {vendor.name}
            </CardTitle>
            {vendor.company && (
              <p className="text-sm text-gray-500 font-medium">{vendor.company.name}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-purple-50"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {vendor.description && (
          <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
            {vendor.description}
          </p>
        )}
        
        <div className="space-y-3 mb-6">
          {vendor.city && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
              <span>{vendor.city}{vendor.zipcode && `, ${vendor.zipcode}`}</span>
            </div>
          )}
          
          {(vendor.price_range_start || vendor.price_range_end) && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-900">Pricing</span>
                <div className="text-right">
                  <div className="text-sm font-bold text-purple-700">
                    {vendor.price_range_start && vendor.price_range_end
                      ? `${formatPrice(vendor.price_range_start)} - ${formatPrice(vendor.price_range_end)}`
                      : vendor.price_range_start
                        ? `From ${formatPrice(vendor.price_range_start)}`
                        : vendor.price_range_end
                          ? `Up to ${formatPrice(vendor.price_range_end)}`
                          : "Contact for pricing"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 mb-6">
          {vendor.company?.business_email && (
            <div className="flex items-center text-xs text-gray-500">
              <Mail className="h-3 w-3 mr-2 text-purple-400" />
              <span className="truncate">{vendor.company.business_email}</span>
            </div>
          )}
          
          {vendor.company?.business_phone && (
            <div className="flex items-center text-xs text-gray-500">
              <Phone className="h-3 w-3 mr-2 text-purple-400" />
              <span>{vendor.company.business_phone}</span>
            </div>
          )}
          
          {vendor.company?.website_url && (
            <div className="flex items-center text-xs text-gray-500">
              <Globe className="h-3 w-3 mr-2 text-purple-400" />
              <span className="truncate">{vendor.company.website_url}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium">
            Get Quote
          </Button>
          <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const VenueCard = ({ venue }: { venue: ILEAVenue }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getVenueTypeFromAmenities = () => {
    if (venue.amenities?.venue_type) {
      return formatVenueType(venue.amenities.venue_type);
    }
    return "Event Venue";
  };

  const getCapacityDisplay = () => {
    if (venue.capacity) {
      if (venue.capacity >= 1000) {
        return `${(venue.capacity / 1000).toFixed(1)}K guests`;
      }
      return `${venue.capacity} guests`;
    }
    return "Capacity varies";
  };

  const getSpaceDetails = () => {
    const details = [];
    if (venue.amenities?.space_sqft) {
      details.push(`${venue.amenities.space_sqft.toLocaleString()} sq ft`);
    }
    if (venue.amenities?.indoor_sqft) {
      details.push(`${venue.amenities.indoor_sqft.toLocaleString()} sq ft indoor`);
    }
    if (venue.amenities?.outdoor_sqft) {
      details.push(`${venue.amenities.outdoor_sqft.toLocaleString()} sq ft outdoor`);
    }
    if (venue.amenities?.pavilion_sqft) {
      details.push(`${venue.amenities.pavilion_sqft.toLocaleString()} sq ft pavilion`);
    }
    if (venue.amenities?.lawn_sqft) {
      details.push(`${venue.amenities.lawn_sqft.toLocaleString()} sq ft lawn`);
    }
    return details.join(" • ");
  };

  const getVenueFeatures = () => {
    const features = [];
    if (venue.amenities?.features && Array.isArray(venue.amenities.features)) {
      features.push(...venue.amenities.features.map((f: string) => formatVenueType(f)));
    }
    if (venue.amenities?.historic) {
      features.push("Historic Venue");
    }
    if (venue.amenities?.city_owned) {
      features.push("City Owned");
    }
    if (venue.amenities?.levels) {
      features.push(`${venue.amenities.levels} Levels`);
    }
    return features;
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border border-purple-100 hover:border-purple-300 bg-white">
      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs font-medium">
                ILEA Certified
              </Badge>
              <Badge variant="outline" className="text-xs">
                {getVenueTypeFromAmenities()}
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-1">
              {venue.name}
            </CardTitle>
            {venue.company && (
              <p className="text-sm text-gray-500 font-medium">{venue.company.name}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-purple-50"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3 mb-6">
          {venue.location && (
            <div className="flex items-start text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0 mt-0.5" />
              <div>
                <span>{venue.location}</span>
                {venue.amenities?.location_note && (
                  <div className="text-xs text-gray-500 mt-1">{venue.amenities.location_note}</div>
                )}
              </div>
            </div>
          )}
          
          <div className="bg-purple-50 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-900">Capacity</span>
              <div className="flex items-center text-sm font-bold text-purple-700">
                <Users className="h-4 w-4 mr-1" />
                {getCapacityDisplay()}
              </div>
            </div>
            
            {getSpaceDetails() && (
              <div className="text-xs text-purple-600 border-t border-purple-200 pt-2">
                {getSpaceDetails()}
              </div>
            )}
          </div>

          {getVenueFeatures().length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Features</h4>
              <div className="flex flex-wrap gap-1">
                {getVenueFeatures().slice(0, 4).map((feature, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {feature}
                  </span>
                ))}
                {getVenueFeatures().length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    +{getVenueFeatures().length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 mb-6">
          {venue.company?.business_email && (
            <div className="flex items-center text-xs text-gray-500">
              <Mail className="h-3 w-3 mr-2 text-purple-400" />
              <span className="truncate">{venue.company.business_email}</span>
            </div>
          )}
          
          {venue.company?.business_phone && (
            <div className="flex items-center text-xs text-gray-500">
              <Phone className="h-3 w-3 mr-2 text-purple-400" />
              <span>{venue.company.business_phone}</span>
            </div>
          )}
          
          {venue.company?.website_url && (
            <div className="flex items-center text-xs text-gray-500">
              <Globe className="h-3 w-3 mr-2 text-purple-400" />
              <span className="truncate">{venue.company.website_url}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium">
            Request Proposal
          </Button>
          {venue.amenities?.booking_link && (
            <Button 
              variant="outline" 
              size="sm" 
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
              onClick={() => window.open(venue.amenities.booking_link, '_blank')}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ILEAMarketplace = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("venues");
  const [selectedCity, setSelectedCity] = useState("Austin");

  const { data: vendors, isLoading: vendorsLoading, error: vendorsError } = useQuery({
    queryKey: ["ilea_vendors", selectedCity],
    queryFn: () => fetchILEAVendors(selectedCity),
  });

  const { data: venues, isLoading: venuesLoading, error: venuesError } = useQuery({
    queryKey: ["ilea_venues", selectedCity],
    queryFn: () => fetchILEAVenues(selectedCity),
  });

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 mb-8 rounded-xl border border-purple-100">
        <div className="flex items-center mb-6">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <Users className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              ILEA Marketplace
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Connect with trusted International Live Events Association (ILEA) members. 
              Find certified event professionals, venues, and vendors who meet the highest industry standards.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-sm font-medium">Certified Members</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center">
              <Building className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium">Professional Venues</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center">
              <Store className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm font-medium">Trusted Vendors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-purple-50 border border-purple-200">
          <TabsTrigger value="venues" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Building className="h-4 w-4" />
            ILEA Venues ({venues?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Store className="h-4 w-4" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venuesLoading && (
              <div className="col-span-full flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            )}

            {venuesError && (
              <div className="col-span-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                <p>Failed to load ILEA venues. Please try again later.</p>
              </div>
            )}

            {venues && venues.length === 0 && !venuesLoading && (
              <div className="col-span-full text-center py-12">
                <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No ILEA Venues Found
                </h3>
                <p className="text-gray-500">
                  {selectedCity 
                    ? `No ILEA venues found in ${selectedCity}. Try a different city.` 
                    : "No ILEA venues available at the moment."}
                </p>
              </div>
            )}

            {venues?.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendorsLoading && (
              <div className="col-span-full flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            )}

            {vendorsError && (
              <div className="col-span-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                <p>Failed to load ILEA vendors. Please try again later.</p>
              </div>
            )}

            {vendors && vendors.length === 0 && !vendorsLoading && (
              <div className="col-span-full text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No ILEA Vendors Found
                </h3>
                <p className="text-gray-500">
                  {selectedCity 
                    ? `No ILEA vendors found in ${selectedCity}. Try a different city.` 
                    : "No ILEA vendors available at the moment."}
                </p>
              </div>
            )}

            {vendors?.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ILEAMarketplace;
