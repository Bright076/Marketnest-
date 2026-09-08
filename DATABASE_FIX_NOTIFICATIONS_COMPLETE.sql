-- ============================================
-- COMPLETE FIX: Guest Orders Notification Issue
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor
-- This is a comprehensive fix that handles all cases

-- STEP 1: Make user_id nullable in notifications table
-- This allows notifications without a user (for future guest features)
ALTER TABLE notifications 
ALTER COLUMN user_id DROP NOT NULL;

-- STEP 2: Update the order status change trigger to handle NULL user_id
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
  notification_type TEXT;
BEGIN
  -- Skip notification if this is a guest order (user_id is NULL)
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Only create notification if order_status changed
  IF OLD.order_status IS DISTINCT FROM NEW.order_status THEN
    -- Determine notification content based on status
    CASE NEW.order_status
      WHEN 'pending' THEN
        notification_title := 'Order Confirmed';
        notification_message := 'Your order #' || LEFT(NEW.id::TEXT, 8) || ' has been confirmed and is awaiting processing.';
        notification_type := 'order_confirmed';
      WHEN 'processing' THEN
        notification_title := 'Order Processing';
        notification_message := 'Your order #' || LEFT(NEW.id::TEXT, 8) || ' is now being processed.';
        notification_type := 'processing';
      WHEN 'shipped' THEN
        notification_title := 'Order Shipped';
        notification_message := 'Great news! Your order #' || LEFT(NEW.id::TEXT, 8) || ' has been shipped and is on its way to you.';
        notification_type := 'shipped';
      WHEN 'delivered' THEN
        notification_title := 'Order Delivered';
        notification_message := 'Your order #' || LEFT(NEW.id::TEXT, 8) || ' has been delivered. We hope you enjoy your purchase!';
        notification_type := 'delivered';
      WHEN 'cancelled' THEN
        notification_title := 'Order Cancelled';
        notification_message := 'Your order #' || LEFT(NEW.id::TEXT, 8) || ' has been cancelled.';
        notification_type := 'cancelled';
      ELSE
        notification_title := 'Order Status Update';
        notification_message := 'Your order #' || LEFT(NEW.id::TEXT, 8) || ' status has been updated to ' || NEW.order_status || '.';
        notification_type := 'general_announcement';
    END CASE;

    -- Insert notification (user_id is guaranteed NOT NULL here)
    INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
    VALUES (NEW.user_id, notification_title, notification_message, notification_type, FALSE, NOW());
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the order operation
    RAISE WARNING 'Failed to create notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 3: Update the payment status change trigger to handle NULL user_id
CREATE OR REPLACE FUNCTION notify_payment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Skip notification if this is a guest order (user_id is NULL)
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Only create notification if payment_status changed to 'paid'
  IF OLD.payment_status IS DISTINCT FROM NEW.payment_status AND NEW.payment_status = 'paid' THEN
    INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
    VALUES (
      NEW.user_id,
      'Payment Received',
      'We have received your payment for order #' || LEFT(NEW.id::TEXT, 8) || '. Thank you!',
      'payment_received',
      FALSE,
      NOW()
    );
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the order operation
    RAISE WARNING 'Failed to create payment notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 4: Verify the changes
SELECT 
  'notifications table user_id constraint' as check_name,
  CASE 
    WHEN is_nullable = 'YES' THEN '✅ user_id is nullable'
    ELSE '❌ user_id is still NOT NULL'
  END as status
FROM information_schema.columns
WHERE table_name = 'notifications' 
  AND column_name = 'user_id';

-- STEP 5: Show updated trigger functions
SELECT 
  proname as function_name,
  '✅ Updated' as status
FROM pg_proc 
WHERE proname IN ('notify_order_status_change', 'notify_payment_status_change');

-- ✅ COMPLETE!
-- Test guest checkout - should work now without any errors
