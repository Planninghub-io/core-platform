
import { createClient, Provider } from '@supabase/supabase-js';
import type { Database } from './types';

export const SUPABASE_URL = "https://asexlqsjachwhabzvzwk.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZXhscXNqYWNod2hhYnp2endrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMDczMzAsImV4cCI6MjA1NDc4MzMzMH0.LmkXoRHxqsRfQUK1KEyn70Z7gkxLVnAGY_G6nKeZFCw";

// Make sure we use the correct URL for callback
export const APP_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'http://localhost:5173'; // Fallback for SSR

// Create a Supabase client with the correct auth options
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Using PKCE flow for security
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
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
  // Ensure we have a proper origin
  const origin = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'http://localhost:5173';

  return {
    provider: provider as Provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
      // Add prompt parameter for Google to force account selection
      ...(provider === 'google' && {
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline'
        }
      })
    }
  };
};
