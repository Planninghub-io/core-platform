
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';

// Create a client with cache reset functionality
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute (reduced from 5 minutes)
      retry: 1,
      refetchOnWindowFocus: true, // Changed to true to refetch data when focus returns
      refetchOnMount: 'always', // Always refetch on component mount
    },
  },
});

// Clear any existing cache
if (typeof window !== 'undefined') {
  // Clear browser cache for the application (localStorage/sessionStorage)
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear React Query cache
  queryClient.clear();
  
  // Force reload with cache clearing if coming from a redirect
  if (window.performance && window.performance.navigation.type === 1) {
    console.log('Application cache cleared successfully');
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
