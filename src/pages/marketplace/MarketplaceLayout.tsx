
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import SideNav from '@/components/SideNav';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sparkles, Store, Building, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MarketplaceLayout: React.FC = () => {
  const location = useLocation();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <SideNav />
        <div className="flex-1">
          <div className="container max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
            
            <div className="mb-6 flex gap-4">
              <Button 
                variant={location.pathname === '/marketplace' && location.pathname.split('/').length === 2 ? "default" : "outline"} 
                asChild
              >
                <NavLink to="/marketplace" end>
                  <Store className="mr-2 h-4 w-4" />
                  All
                </NavLink>
              </Button>

              <Button 
                variant={location.pathname === '/marketplace/venues' ? "default" : "outline"} 
                asChild
              >
                <NavLink to="/marketplace/venues">
                  <Building className="mr-2 h-4 w-4" />
                  Venues
                </NavLink>
              </Button>

              <Button 
                variant={location.pathname === '/marketplace/vendors' ? "default" : "outline"} 
                asChild
              >
                <NavLink to="/marketplace/vendors">
                  <Compass className="mr-2 h-4 w-4" />
                  Vendors
                </NavLink>
              </Button>

              <Button 
                variant={location.pathname === '/marketplace/recommendations' ? "default" : "outline"} 
                asChild
              >
                <NavLink to="/marketplace/recommendations">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Recommendations
                </NavLink>
              </Button>
            </div>
            
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MarketplaceLayout;
