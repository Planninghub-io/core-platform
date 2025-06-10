
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  Compass,
  Building,
  PlusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SideNavProps {
  onNavigate?: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({ onNavigate }) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: PlusCircle, label: 'Create Event', path: '/create-event' },
    { icon: Calendar, label: 'Events Hub', path: '/events-hub' },
    { icon: Compass, label: 'Discover', path: '/discover' },
    { icon: Building, label: 'Marketplace', path: '/marketplace' },
    { icon: Users, label: 'Campaign Hub', path: '/campaign-hub' },
    { icon: Settings, label: 'Settings', path: '/settings/profile' },
  ];

  return (
    <nav className={`
      h-full bg-white border-r border-gray-200 flex flex-col
      ${isMobile ? 'pt-4' : 'pt-6'}
    `}>
      {/* Logo/Title */}
      <div className={`px-4 ${isMobile ? 'pb-4' : 'pb-6'}`}>
        <h2 className="text-xl font-bold text-gray-900">Event Generator</h2>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-gray-100 active:bg-gray-200",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-gray-700 hover:text-gray-900"
                  )}
                >
                  <Icon size={isMobile ? 20 : 18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Event Generator v1.0
        </p>
      </div>
    </nav>
  );
};
