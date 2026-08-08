-- Fix Orders RLS so Admin can see all orders
-- This fixes: Orders not showing in admin dashboard

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Allow all authenticated users to view orders" ON orders;

-- Policy 1: Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy 2: Admins can view ALL orders
CREATE POLICY "Admins can view all orders" ON orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy 3: Authenticated users can insert their own orders
CREATE POLICY "Users can insert own orders" ON orders
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy 4: Admins can update any order
CREATE POLICY "Admins can update orders" ON orders
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Verify policies
SELECT 
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY policyname;
