-- ============================================
-- DEBUG: Find What's Creating Notifications
-- ============================================
-- Run this to diagnose the notification issue

-- 1. Check if user_id is nullable in notifications table
SELECT 
  table_name,
  column_name,
  is_nullable,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'notifications' 
  AND column_name = 'user_id';

-- 2. Check all triggers on orders table
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'orders';

-- 3. Show the current trigger function definitions
SELECT 
  proname as function_name,
  prosrc as function_body
FROM pg_proc 
WHERE proname IN ('notify_order_status_change', 'notify_payment_status_change');

-- 4. Check for any policies that might affect notifications
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

-- 5. Recent failed attempts in notifications table
-- (This might not work if you don't have error logging, but worth a try)
SELECT * FROM notifications WHERE user_id IS NULL ORDER BY created_at DESC LIMIT 5;

-- 6. Check orders table structure
SELECT 
  column_name,
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_name = 'orders' 
  AND column_name IN ('id', 'user_id', 'order_status', 'payment_status');

-- Run all these queries and share the results
-- This will help identify exactly what's causing the issue
