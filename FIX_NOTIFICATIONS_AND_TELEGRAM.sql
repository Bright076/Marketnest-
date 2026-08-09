-- FIX 1: Ensure notifications RLS policies are correct for mark as read
-- Drop existing policies and recreate them

-- Drop all existing policies on notifications table
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "Allow notification creation" ON notifications;
DROP POLICY IF EXISTS "Allow all authenticated users to insert notifications" ON notifications;

-- Recreate policies with correct permissions

-- 1. Users can view their own notifications
CREATE POLICY "Users can view own notifications" 
ON notifications FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- 2. Users can UPDATE their own notifications (for mark as read)
CREATE POLICY "Users can update own notifications" 
ON notifications FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Users can DELETE their own notifications
CREATE POLICY "Users can delete own notifications" 
ON notifications FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- 4. Allow anyone to INSERT notifications (needed for checkout/admin)
CREATE POLICY "Allow all to insert notifications" 
ON notifications FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Verify RLS is enabled
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Test query to check policies
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
