
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { SidebarProvider } from "./components/ui/sidebar";
import Index from "./pages/Index";
import CreateEvent from "./pages/CreateEvent";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import SideNav from "./components/SideNav";
import Discover from "./pages/Discover";
import EventsHub from "./pages/EventsHub";
import EventDetails from "./pages/EventDetails";
import EventInvitations from "./pages/EventInvitations";
import EventTicketing from "./pages/EventTicketing";
import SettingsLayout from "./pages/settings/SettingsLayout";
import UserProfileSettings from "./pages/settings/UserProfileSettings";
import CompanySettings from "./pages/settings/CompanySettings";
import BillingSettings from "./pages/settings/BillingSettings";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setIsAuthenticated(!!session);
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Auth error:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              {isAuthenticated && <SideNav />}
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route 
                    path="/create-event" 
                    element={isAuthenticated ? <CreateEvent /> : <Navigate to="/auth" replace />} 
                  />
                  <Route 
                    path="/discover" 
                    element={isAuthenticated ? <Discover /> : <Navigate to="/auth" replace />} 
                  />
                  <Route 
                    path="/events-hub" 
                    element={isAuthenticated ? <EventsHub /> : <Navigate to="/auth" replace />} 
                  />
                  <Route 
                    path="/event/:id" 
                    element={isAuthenticated ? <EventDetails /> : <Navigate to="/auth" replace />} 
                  />
                  <Route 
                    path="/event/:id/invitations" 
                    element={isAuthenticated ? <EventInvitations /> : <Navigate to="/auth" replace />} 
                  />
                  <Route 
                    path="/event/:id/ticketing" 
                    element={isAuthenticated ? <EventTicketing /> : <Navigate to="/auth" replace />} 
                  />
                  <Route 
                    path="/settings" 
                    element={isAuthenticated ? <SettingsLayout /> : <Navigate to="/auth" replace />}
                  >
                    <Route index element={<Navigate to="profile" replace />} />
                    <Route path="profile" element={<UserProfileSettings />} />
                    <Route path="company" element={<CompanySettings />} />
                    <Route path="billing" element={<BillingSettings />} />
                  </Route>
                  <Route 
                    path="/auth" 
                    element={!isAuthenticated ? <Auth /> : <Navigate to="/" replace />} 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
