
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import SideNav from '@/components/SideNav';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sparkles } from 'lucide-react';

const MarketplaceLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <SideNav />
        <div className="flex-1">
          <div className="container max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
            
            <div className="mb-6 border-b">
              <nav className="flex space-x-8">
                <NavLink
                  to="/marketplace"
                  end
                  className={({ isActive }) =>
                    `pb-4 px-1 font-medium text-sm ${
                      isActive
                        ? 'border-b-2 border-[#8b73f4] text-[#8b73f4]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`
                  }
                >
                  All
                </NavLink>
                <NavLink
                  to="/marketplace/venues"
                  className={({ isActive }) =>
                    `pb-4 px-1 font-medium text-sm ${
                      isActive
                        ? 'border-b-2 border-[#8b73f4] text-[#8b73f4]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`
                  }
                >
                  Venues
                </NavLink>
                <NavLink
                  to="/marketplace/vendors"
                  className={({ isActive }) =>
                    `pb-4 px-1 font-medium text-sm ${
                      isActive
                        ? 'border-b-2 border-[#8b73f4] text-[#8b73f4]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`
                  }
                >
                  Vendors
                </NavLink>
                <NavLink
                  to="/marketplace/recommendations"
                  className={({ isActive }) =>
                    `pb-4 px-1 font-medium flex items-center text-sm ${
                      isActive
                        ? 'border-b-2 border-[#8b73f4] text-[#8b73f4]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`
                  }
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  AI Recommendations
                </NavLink>
              </nav>
            </div>
            
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MarketplaceLayout;
