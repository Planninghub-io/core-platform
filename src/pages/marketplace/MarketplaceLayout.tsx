
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Store, Building, Compass, Code, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MarketplaceLayout: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="flex-1">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
        
        <div className="mb-6 flex flex-wrap gap-4">
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
            variant={location.pathname.includes('/marketplace/venues') ? "default" : "outline"} 
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
            variant={location.pathname === '/marketplace/ilea' ? "default" : "outline"} 
            asChild
          >
            <NavLink to="/marketplace/ilea">
              <Users className="mr-2 h-4 w-4" />
              ILEA
            </NavLink>
          </Button>

          <Button 
            variant={location.pathname === '/marketplace/embed' ? "default" : "outline"} 
            asChild
          >
            <NavLink to="/marketplace/embed">
              <Code className="mr-2 h-4 w-4" />
              Embed
            </NavLink>
          </Button>
        </div>
        
        <Outlet />
      </div>
    </div>
  );
};

export default MarketplaceLayout;
