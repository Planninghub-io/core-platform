
import { Outlet } from 'react-router-dom';
import { SideNav } from '@/components/SideNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MainLayout = () => {
  const isMobile = useIsMobile();
  const [sideNavOpen, setSideNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Event Generator</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSideNavOpen(!sideNavOpen)}
              className="md:hidden"
            >
              {sideNavOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </header>
      )}

      <div className="flex h-screen">
        {/* Mobile Overlay */}
        {isMobile && sideNavOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSideNavOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          ${isMobile 
            ? `fixed left-0 top-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out ${sideNavOpen ? 'translate-x-0' : '-translate-x-full'}`
            : 'relative'
          }
          ${!isMobile ? 'w-64' : ''}
          bg-white border-r border-gray-200 flex-shrink-0
        `}>
          <SideNav onNavigate={() => isMobile && setSideNavOpen(false)} />
        </aside>

        {/* Main Content */}
        <main className={`
          flex-1 overflow-hidden
          ${isMobile ? 'pt-0' : 'pt-0'}
        `}>
          <div className="h-full overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
