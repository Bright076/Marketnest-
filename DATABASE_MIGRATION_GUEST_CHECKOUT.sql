-- MarketNest: Enable Guest Checkout
-- Run this in Supabase SQL Editor

-- Make user_id nullable to allow guest orders
ALTER TABLE orders 
ALTER COLUMN user_id DROP NOT NULL;

-- Add comment
COMMENT ON COLUMN orders.user_id IS 'User ID if logged in, NULL for guest orders';

-- Verify the change
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name = 'user_id';
