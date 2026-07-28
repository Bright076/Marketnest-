-- Orders Table Update
-- Add currency and payment_method columns
-- Run this in Supabase SQL Editor

-- Step 1: Add currency column (defaults to USD for all orders)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- Step 2: Add payment_method column
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Step 3: Add comments
COMMENT ON COLUMN public.orders.currency IS 'Payment currency: Always USD';
COMMENT ON COLUMN public.orders.payment_method IS 'Payment method: card (for Nigeria) or crypto (for international)';

-- Step 4: Update existing orders to USD if needed
UPDATE public.orders 
SET currency = 'USD' 
WHERE currency IS NULL OR currency = '';

-- Verify
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders' 
AND column_name IN ('currency', 'payment_method');

-- Example query to see orders with new fields
-- SELECT id, customer_name, amount_paid, currency, payment_method, payment_status, order_status
-- FROM orders
-- ORDER BY created_at DESC
-- LIMIT 10;
