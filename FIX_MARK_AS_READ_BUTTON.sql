-- Fix for "Mark as Read" button in user notifications
-- Run this in Supabase SQL Editor

-- Drop existing policy
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

-- Recreate with correct permissions
CREATE POLICY "Users can update own notifications" 
ON notifications FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'notifications' 
AND policyname = 'Users can update own notifications';
