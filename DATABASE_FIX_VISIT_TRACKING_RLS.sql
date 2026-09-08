-- ============================================
-- FIX: Visit Tracking RLS Policies
-- ============================================
-- The visits table needs RLS policies to allow tracking from client-side
-- Run this in Supabase SQL Editor

-- Enable RLS on visits table
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (prevents errors on re-run)
DROP POLICY IF EXISTS "Allow all to insert visits" ON visits;
DROP POLICY IF EXISTS "Allow authenticated to view visits" ON visits;
DROP POLICY IF EXISTS "Service role has full access to visits" ON visits;

-- Policy 1: Allow anyone (including anonymous) to insert visits
-- This allows the visit tracker to work without authentication
CREATE POLICY "Allow all to insert visits"
ON visits
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Policy 2: Only authenticated users (admins) can view visits
-- This protects analytics data from being publicly readable
CREATE POLICY "Allow authenticated to view visits"
ON visits
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Service role has full access (for backend operations)
CREATE POLICY "Service role has full access to visits"
ON visits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Verify policies were created
SELECT 
  policyname,
  cmd,
  roles,
  CASE 
    WHEN cmd = 'INSERT' AND 'anon' = ANY(roles) THEN '✅ Tracking will work'
    WHEN cmd = 'SELECT' AND 'authenticated' = ANY(roles) THEN '✅ Stats protected'
    ELSE '✅ Policy active'
  END as status
FROM pg_policies 
WHERE tablename = 'visits'
ORDER BY policyname;

-- ✅ Done! Visit tracking should work now
