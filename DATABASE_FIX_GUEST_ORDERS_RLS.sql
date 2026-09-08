-- MarketNest: Fix Row-Level Security for Guest Orders
-- Run this in Supabase SQL Editor

-- Step 1: Check what policies currently exist
SELECT policyname FROM pg_policies WHERE tablename = 'orders';

-- Step 2: Drop ALL existing policies (adjust names based on what you see above)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'orders'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON orders';
    END LOOP;
END $$;

-- Step 3: Create new policies that allow guest orders

-- 1. INSERT Policy: Allow anyone to create orders (logged-in or guest)
CREATE POLICY "Allow all inserts for orders"
ON orders
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- 2. SELECT Policy: Users can view their own orders
CREATE POLICY "Users can view own orders"
ON orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. Allow service role (backend) to do everything (for admin operations)
CREATE POLICY "Service role has full access"
ON orders
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 4: Verify policies are created
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY policyname;
