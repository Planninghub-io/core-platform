
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://asexlqsjachwhabzvzwk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZXhscXNqYWNod2hhYnp2endrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMDczMzAsImV4cCI6MjA1NDc4MzMzMH0.LmkXoRHxqsRfQUK1KEyn70Z7gkxLVnAGY_G6nKeZFCw"

// Production URL for redirects
export const PRODUCTION_URL = "https://yourplanner.ai";
export const APP_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : PRODUCTION_URL;

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Configure OAuth redirect with proper domain handling
export const configureOAuthRedirect = (provider: 'google' | 'apple') => {
  // Always use the production URL for OAuth redirects to avoid domain issues
  const redirectTo = `${PRODUCTION_URL}/auth/callback`;
  
  console.log(`Configuring ${provider} OAuth with redirect:`, redirectTo);
  
  return {
    provider,
    options: {
      redirectTo,
      queryParams: provider === 'google' ? {
        access_type: 'offline',
        prompt: 'consent'
      } : undefined
    }
  };
};
