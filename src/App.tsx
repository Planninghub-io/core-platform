
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Discover from '@/pages/Discover';
import EventsHub from '@/pages/EventsHub';
import EventDetails from '@/pages/EventDetails';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import EventInvitations from '@/pages/EventInvitations';
import EventTicketing from '@/pages/EventTicketing';
import CreateEvent from '@/pages/CreateEvent';
import Auth from '@/pages/Auth';
import OAuthCallback from '@/pages/auth/OAuthCallback';
import PasswordReset from '@/pages/auth/PasswordReset';
import ResetPassword from '@/pages/auth/ResetPassword';
import MFASetup from '@/pages/auth/MFASetup';
import MFAChallenge from '@/pages/auth/MFAChallenge';
import EmailVerification from '@/pages/auth/EmailVerification';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SettingsLayout from '@/pages/settings/SettingsLayout';
import UserProfileSettings from '@/pages/settings/UserProfileSettings';
import CompanySettings from '@/pages/settings/CompanySettings';
import BillingSettings from '@/pages/settings/BillingSettings';
import MarketplaceLayout from '@/pages/marketplace/MarketplaceLayout';
import Marketplace from '@/pages/marketplace/Marketplace';
import Venues from '@/pages/marketplace/Venues';
import Vendors from '@/pages/marketplace/Vendors';
import VenueRecommendations from "./pages/marketplace/VenueRecommendations";
import EventManagement from './pages/event-management/EventManagement';
import ProfileSetup from './pages/ProfileSetup';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  console.log("App component rendering");
  
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/events-hub" element={<EventsHub />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/event/:id/invitations" element={<EventInvitations />} />
          <Route path="/event/:id/tickets" element={<EventTicketing />} />
          <Route path="/event/:id/manage" element={<EventManagement />} />
          <Route path="/create-event" element={<CreateEvent />} />

          {/* Auth routes */}
          <Route path="/auth/*" element={<Auth />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="/auth/password-reset" element={<PasswordReset />} />
          <Route path="/auth/new-password" element={<ResetPassword />} />
          <Route path="/auth/email-verification" element={<EmailVerification />} />
          <Route path="/auth/mfa-setup" element={<MFASetup />} />
          <Route path="/auth/mfa-challenge" element={<MFAChallenge />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          
          {/* Legal pages */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* IMPORTANT: Make these routes top-level routes for proper handling of reset password links */}
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/new-password" element={<ResetPassword />} />

          {/* Settings routes */}
          <Route path="/settings" element={<SettingsLayout />}>
            <Route index element={<UserProfileSettings />} />
            <Route path="company" element={<CompanySettings />} />
            <Route path="billing" element={<BillingSettings />} />
          </Route>

          {/* Marketplace routes */}
          <Route path="/marketplace" element={<MarketplaceLayout />}>
            <Route index element={<Marketplace />} />
            <Route path="venues" element={<Venues />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="recommendations" element={<VenueRecommendations />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </QueryClientProvider>
    </>
  );
}

export default App;
