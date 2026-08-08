-- Fix Notifications RLS Policy
-- This fixes: "new row violates row-level security policy for table notifications"

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Admins can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
DROP POLICY IF EXISTS "Allow authenticated users to insert notifications" ON notifications;

-- Create new INSERT policy that allows:
-- 1. Admins to insert notifications for anyone
-- 2. Users to insert notifications for themselves (for order confirmations)
CREATE POLICY "Allow notification creation" ON notifications
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow if user is admin (can create for anyone)
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
  OR
  -- Allow if user is creating notification for themselves
  user_id = auth.uid()
);

-- Verify existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'notifications'
ORDER BY policyname;
