
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useUserProfile } from '@/hooks/useUserProfile';
import { MainLayout } from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import EventCreationPage from '@/pages/EventCreationPage';
import LandingPage from '@/pages/LandingPage';
import PricingPage from '@/pages/PricingPage';
import AuthPage from '@/pages/AuthPage';
import ProfileSetupPage from '@/pages/ProfileSetupPage';
import EventDetailsPage from '@/pages/EventDetailsPage';
import EventDetails from '@/pages/EventDetails';
import SettingsLayout from '@/pages/settings/SettingsLayout';
import UserProfileSettings from '@/pages/settings/UserProfileSettings';
import CompanySettings from '@/pages/settings/CompanySettings';
import BillingSettings from '@/pages/settings/BillingSettings';
import EmailVerificationPage from '@/pages/auth/EmailVerificationPage';
import UserManagement from './pages/admin/UserManagement';
import CampaignHub from './pages/CampaignHub';
import Index from './pages/Index';
import EventsHub from './pages/EventsHub';
import CreateEvent from './pages/CreateEvent';
import Discover from './pages/Discover';
import NotFound from './pages/NotFound';
import MarketplaceLayout from './pages/marketplace/MarketplaceLayout';
import Marketplace from './pages/marketplace/Marketplace';
import Venues from './pages/marketplace/Venues';
import Vendors from './pages/marketplace/Vendors';
import ILEAMarketplace from './pages/marketplace/ILEAMarketplace';
import VenueRecommendations from './pages/marketplace/VenueRecommendations';
import PasswordReset from './pages/auth/PasswordReset';
import ResetPassword from './pages/auth/ResetPassword';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import EventManagement from './pages/event-management/EventManagement';
import EmbedMarketplace from './pages/marketplace/EmbedMarketplace';
import ClientMarketplace from './pages/marketplace/ClientMarketplace';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function App() {
  const { user } = useAuthRedirect({ skipRedirect: true });
  const { isLoading } = useUserProfile();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 2000);
    
    if (!isLoading) {
      clearTimeout(timer);
      setIsInitialized(true);
    }
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Index />} />
          <Route path="landing" element={<LandingPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="checkout" element={user ? <CheckoutPage /> : <Navigate to="/auth" replace state={{ redirectPath: '/settings/billing' }} />} />
          <Route path="checkout-success" element={user ? <CheckoutSuccessPage /> : <Navigate to="/auth" replace state={{ redirectPath: '/settings/billing' }} />} />
          
          <Route path="events/:eventId" element={<EventDetailsPage />} />
          <Route path="event/:id" element={<Navigate to="/events/:id" replace />} />
          <Route path="event/:id/edit" element={<Navigate to="/events/:id?edit=true" replace />} />
          <Route path="events/:eventId/manage" element={<EventManagement />} />
          
          <Route path="events-hub" element={<EventsHub />} />
          <Route path="discover" element={<Discover />} />
          {/* Changed to allow non-authenticated users to access create-event */}
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="campaign-hub" element={<CampaignHub />} />
          
          <Route path="marketplace" element={<MarketplaceLayout />}>
            <Route index element={<Marketplace />} />
            <Route path="venues" element={<Venues />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="ilea" element={<ILEAMarketplace />} />
            <Route path="recommendations" element={<VenueRecommendations />} />
            <Route path="embed" element={<EmbedMarketplace />} />
          </Route>
          
          <Route path="client/:slug" element={<ClientMarketplace />} />
          
          <Route path="settings" element={user ? <SettingsLayout /> : <Navigate to="/auth" replace state={{ redirectPath: '/settings' }} />}>
            <Route path="profile" element={<UserProfileSettings />} />
            <Route path="company" element={<CompanySettings />} />
            <Route path="billing" element={<BillingSettings />} />
          </Route>
          
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
        </Route>
        
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<AuthPage />} />
          <Route path="email-verification" element={<EmailVerificationPage />} />
          <Route path="password-reset" element={<PasswordReset />} />
          <Route path="new-password" element={<ResetPassword />} />
        </Route>
        
        <Route path="/profile-setup" element={user ? <ProfileSetupPage /> : <Navigate to="/auth" replace state={{ redirectPath: '/profile-setup' }} />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
