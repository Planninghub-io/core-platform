
import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Discover from './pages/Discover';
import EventsHub from './pages/EventsHub';
import EventDetails from './pages/EventDetails';
import Auth from './pages/Auth';
import { Toaster } from "@/components/ui/toaster"
import PasswordReset from './pages/auth/PasswordReset';
import ResetPassword from './pages/auth/ResetPassword';

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/events-hub" element={<EventsHub />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/password-reset" element={<PasswordReset />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
        </Routes>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
