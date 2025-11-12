-- Fix PUBLIC_DATA_EXPOSURE: Remove overly permissive policy on user_profiles
-- This policy allows anyone to read all users' PII without authentication
DROP POLICY IF EXISTS "Allow users to read all profiles" ON public.user_profiles;

-- The correctly scoped policy "Users can read own profile" already exists
-- with USING (auth.uid() = id), so we only need to remove the permissive one