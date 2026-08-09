-- Fix for "Mark as Read" button in user notifications
-- Run this in Supabase SQL Editor

-- Step 1: Check current policies
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
WHERE tablename = 'notifications';

-- Step 2: Drop ALL existing policies on notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "Allow notification creation" ON notifications;
DROP POLICY IF EXISTS "Allow all to insert notifications" ON notifications;
DROP POLICY IF EXISTS "Allow all authenticated users to insert notifications" ON notifications;

-- Step 3: Ensure RLS is enabled
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new policies with correct permissions

-- Allow users to view their own notifications
CREATE POLICY "Users can view own notifications" 
ON notifications FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow users to UPDATE their own notifications (for mark as read)
CREATE POLICY "Users can update own notifications" 
ON notifications FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to DELETE their own notifications
CREATE POLICY "Users can delete own notifications" 
ON notifications FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow all authenticated users to INSERT notifications
CREATE POLICY "Allow all to insert notifications" 
ON notifications FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Step 5: Verify policies were created
SELECT 
  policyname,
  cmd,
  roles,
  CASE 
    WHEN qual IS NOT NULL THEN 'HAS USING'
    ELSE 'NO USING'
  END as has_using,
  CASE 
    WHEN with_check IS NOT NULL THEN 'HAS WITH CHECK'
    ELSE 'NO WITH CHECK'
  END as has_with_check
FROM pg_policies 
WHERE tablename = 'notifications'
ORDER BY policyname;

