
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const MarketplaceCategories = [
  {
    title: "Venues",
    description: "Find the perfect location for your next event",
    icon: MapPin,
    path: "/marketplace/venues",
    color: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    title: "Vendors",
    description: "Connect with professional service providers",
    icon: Tag,
    path: "/marketplace/vendors",
    color: "bg-purple-100",
    textColor: "text-purple-600",
  },
];

const Marketplace = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {MarketplaceCategories.map((category) => (
          <Card key={category.title} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className={`${category.color} pb-4`}>
              <div className="flex items-center">
                <category.icon className={`h-8 w-8 mr-3 ${category.textColor}`} />
                <CardTitle className="text-2xl">{category.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600">{category.description}</p>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button asChild className="bg-[#8b73f4] hover:bg-[#8b73f4]/90 w-full">
                <Link to={category.path}>
                  Browse {category.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-8 mt-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Coming Soon</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Catering', 'Equipment Rental', 'Entertainment'].map((category) => (
            <Card key={category} className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-xl text-gray-500">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">This category will be available soon.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Marketplace;
