-- SIMPLEST FIX: Allow all authenticated users to insert notifications
-- This fixes: "new row violates row-level security policy for table notifications"

-- Option 1: Allow authenticated users to insert notifications (RECOMMENDED)
DROP POLICY IF EXISTS "Allow notification creation" ON notifications;

CREATE POLICY "Allow notification creation" ON notifications
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow all authenticated users to create notifications

-- Option 2: Disable RLS completely (NOT RECOMMENDED but works)
-- UNCOMMENT if Option 1 doesn't work:
-- ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Verify the policy
SELECT 
  tablename,
  policyname,
  cmd,
  with_check
FROM pg_policies 
WHERE tablename = 'notifications'
AND cmd = 'INSERT';
