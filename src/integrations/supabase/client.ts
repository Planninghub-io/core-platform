import { createClient, Provider } from '@supabase/supabase-js';
import type { Database } from './types';

export const SUPABASE_URL = "https://asexlqsjachwhabzvzwk.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZXhscXNqYWNod2hhYnp2endrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMDczMzAsImV4cCI6MjA1NDc4MzMzMH0.LmkXoRHxqsRfQUK1KEyn70Z7gkxLVnAGY_G6nKeZFCw";

// Make sure we use the correct URL for callback
export const APP_URL = window.location.origin;

// Create a Supabase client with the correct auth options
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Using PKCE flow for security
    storageKey: 'supabase-auth',
    storage: {
      getItem: (key) => {
        try {
          return Promise.resolve(localStorage.getItem(key));
        } catch (error) {
          return Promise.resolve(null);
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
          return Promise.resolve();
        } catch (error) {
          return Promise.resolve();
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
          return Promise.resolve();
        } catch (error) {
          return Promise.resolve();
        }
      }
    }
  }
});

// Helper function to safely handle Supabase queries with proper error checking
export async function safeQuery<T>(queryFn: () => Promise<{ data: T | null; error: any }>) {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }
    
    if (data === null) {
      throw new Error("No data returned from query");
    }
    
    return data as T;
  } catch (err) {
    console.error("Error in safeQuery:", err);
    throw err;
  }
}

// Configuration for OAuth providers
export const configureOAuthRedirect = (provider: string) => {
  return {
    provider: provider as Provider,
    options: {
      redirectTo: `${APP_URL}/auth/callback`
    }
  };
};
