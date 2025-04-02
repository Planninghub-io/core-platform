
import React, { useState, useEffect } from 'react';
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
import ProfileSetup from '@/pages/ProfileSetup';
import EventDetailsPage from '@/pages/EventDetailsPage';
import SettingsLayout from '@/pages/settings/SettingsLayout';
import UserProfileSettings from '@/pages/settings/UserProfileSettings';
import CompanySettings from '@/pages/settings/CompanySettings';
import BillingSettings from '@/pages/settings/BillingSettings';
import EmailVerificationPage from '@/pages/auth/EmailVerificationPage';
import UserManagement from './pages/admin/UserManagement';
import CampaignHub from './pages/CampaignHub';

function App() {
  const { user } = useAuthRedirect();
  const { isLoading } = useUserProfile();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simulate initialization process
    if (!isLoading) {
      setIsInitialized(true);
    }
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
          <Route index element={<LandingPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="events/:eventId" element={<EventDetailsPage />} />
          <Route path="create-event" element={user ? <EventCreationPage /> : <Navigate to="/auth" replace state={{ redirectPath: '/create-event' }} />} />
          <Route path="campaign-hub" element={<CampaignHub />} />
          <Route path="settings" element={user ? <SettingsLayout /> : <Navigate to="/auth" replace state={{ redirectPath: '/settings' }} />}>
            <Route path="profile" element={<UserProfileSettings />} />
            <Route path="company" element={<CompanySettings />} />
            <Route path="billing" element={<BillingSettings />} />
          </Route>
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<AuthPage />} />
          <Route path="email-verification" element={<EmailVerificationPage />} />
        </Route>
        <Route path="/profile-setup" element={user ? <ProfileSetup /> : <Navigate to="/auth" replace state={{ redirectPath: '/profile-setup' }} />} />
        <Route path="/admin/users" element={<UserManagement />} />
      </Routes>
    </>
  );
}

export default App;
