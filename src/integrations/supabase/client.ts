
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://asexlqsjachwhabzvzwk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZXhscXNqYWNod2hhYnp2endrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMDczMzAsImV4cCI6MjA1NDc4MzMzMH0.LmkXoRHxqsRfQUK1KEyn70Z7gkxLVnAGY_G6nKeZFCw";

// Update this to your actual deployed app URL or local development URL
// Do not use Lovable-related URLs
export const APP_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5173' 
  : "https://nice-moss-0d3d9cf0f.5.azurestaticapps.net";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});
