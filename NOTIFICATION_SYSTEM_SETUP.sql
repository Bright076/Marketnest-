-- ===========================================
-- COMPLETE NOTIFICATION SYSTEM SETUP
-- ===========================================
-- Run this SQL in your Supabase SQL Editor

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Add RLS (Row Level Security) policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (prevents errors on re-run)
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can insert notifications" ON notifications;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (mark as read/delete)
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Admins can insert notifications for any user
CREATE POLICY "Admins can insert notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to send notification on order status change
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
  notification_type TEXT;
BEGIN
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

    -- Insert notification
    INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
    VALUES (NEW.user_id, notification_title, notification_message, notification_type, FALSE, NOW());
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS order_status_change_notification ON orders;
CREATE TRIGGER order_status_change_notification
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_status_change();

-- Create or replace function to send notification on payment status change
CREATE OR REPLACE FUNCTION notify_payment_status_change()
RETURNS TRIGGER AS $$
BEGIN
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
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS payment_status_change_notification ON orders;
CREATE TRIGGER payment_status_change_notification
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_status_change();

-- Enable Realtime for notifications table (safe to run multiple times)
DO $$
BEGIN
  -- Check if table is already in publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;
END $$;

-- Add comment to table
COMMENT ON TABLE notifications IS 'Customer notification system with realtime updates';
COMMENT ON COLUMN notifications.type IS 'Notification types: order_confirmed, payment_received, processing, shipped, out_for_delivery, delivered, cancelled, promotional_offer, general_announcement';

-- ✅ Setup Complete!
-- Notifications will now be automatically created when order/payment status changes
-- Realtime updates enabled for instant notifications
