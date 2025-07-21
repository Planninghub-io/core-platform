
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Building, ExternalLink, Phone, Mail, Globe, Star } from "lucide-react";
import { ILEAVendor } from "@/types/ilea";

interface ILEAVendorCardProps {
  vendor: ILEAVendor;
}

export const ILEAVendorCard: React.FC<ILEAVendorCardProps> = ({ vendor }) => {
  const getPriceRange = () => {
    if (vendor.price_range_start && vendor.price_range_end) {
      return `$${vendor.price_range_start.toLocaleString()} - $${vendor.price_range_end.toLocaleString()}`;
    } else if (vendor.price_range_start) {
      return `Starting at $${vendor.price_range_start.toLocaleString()}`;
    }
    return null;
  };

  const getLocation = () => {
    const parts = [];
    if (vendor.city) parts.push(vendor.city);
    if (vendor.zipcode) parts.push(vendor.zipcode);
    return parts.join(", ");
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 border-gray-200 group">
      {/* Image Placeholder */}
      <div className="aspect-[16/10] bg-gradient-to-br from-purple-100 to-purple-200 rounded-t-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-200"></div>
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-purple-700 hover:bg-white/90">
            ILEA Member
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 rounded-full p-2">
            <Star className="h-4 w-4 text-yellow-500" />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Building className="h-12 w-12 text-purple-600/60" />
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
              {vendor.name}
            </CardTitle>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
              Vendor Service
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Description */}
        {vendor.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {vendor.description}
          </p>
        )}

        {/* Location */}
        {getLocation() && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 mt-0.5 text-purple-600 flex-shrink-0" />
            <span className="line-clamp-1">{getLocation()}</span>
          </div>
        )}

        {/* Price Range */}
        {getPriceRange() && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4 text-purple-600" />
            <span className="font-medium">{getPriceRange()}</span>
          </div>
        )}

        {/* Company Info */}
        {vendor.company && (
          <div className="pt-3 border-t space-y-2">
            <h4 className="font-medium text-gray-900 text-sm">{vendor.company.name}</h4>
            <div className="flex flex-wrap gap-3">
              {vendor.company.business_phone && (
                <a
                  href={`tel:${vendor.company.business_phone}`}
                  className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Phone className="h-3 w-3" />
                  <span>Call</span>
                </a>
              )}
              {vendor.company.business_email && (
                <a
                  href={`mailto:${vendor.company.business_email}`}
                  className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  <span>Email</span>
                </a>
              )}
              {vendor.company.website_url && (
                <a
                  href={vendor.company.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Globe className="h-3 w-3" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Contact Button */}
        {vendor.company?.website_url && (
          <Button
            asChild
            className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            size="sm"
          >
            <a
              href={vendor.company.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <span>Contact Vendor</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
