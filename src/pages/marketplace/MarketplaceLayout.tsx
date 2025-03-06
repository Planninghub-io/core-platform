
import React from "react";
import SideNav from "@/components/SideNav";
import { Link, Outlet, useLocation } from "react-router-dom";
import { MapPin, Store, Tag } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";

const tabs = [
  {
    name: "Overview",
    href: "/marketplace",
    icon: Store,
  },
  {
    name: "Venues",
    href: "/marketplace/venues",
    icon: MapPin,
  },
  {
    name: "Vendors",
    href: "/marketplace/vendors",
    icon: Tag,
  },
];

const MarketplaceLayout = () => {
  const location = useLocation();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <SideNav />
        <main className="flex-1 p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
            <p className="mt-2 text-lg text-gray-600">
              Find everything you need for your next event
            </p>
            
            <div className="mt-6 border-b border-gray-200">
              <nav className="flex -mb-px space-x-8">
                {tabs.map((tab) => {
                  const isActive = 
                    (tab.href === "/marketplace" && location.pathname === "/marketplace") ||
                    (tab.href !== "/marketplace" && location.pathname.startsWith(tab.href));
                    
                  return (
                    <Link
                      key={tab.name}
                      to={tab.href}
                      className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 ${
                        isActive
                          ? "border-[#8b73f4] text-[#8b73f4]"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <tab.icon className={`mr-2 h-5 w-5 ${isActive ? "text-[#8b73f4]" : "text-gray-400"}`} />
                      {tab.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>
          
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MarketplaceLayout;
