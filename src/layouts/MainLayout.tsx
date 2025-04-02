
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import SideNav from '@/components/SideNav';

export const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <SideNav />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
