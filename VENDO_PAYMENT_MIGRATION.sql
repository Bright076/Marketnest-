-- Vendo Partner Payments Integration - Database Migration
-- Run this in Supabase SQL Editor

-- Add payment-related columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS merchant_order_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS partner_reference TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS flutterwave_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Add index for faster webhook lookups
CREATE INDEX IF NOT EXISTS idx_orders_merchant_order_id ON public.orders(merchant_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_partner_reference ON public.orders(partner_reference);

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name IN (
  'payment_method',
  'currency',
  'merchant_order_id',
  'partner_reference',
  'flutterwave_transaction_id',
  'paid_at'
)
ORDER BY column_name;

SELECT 'Migration complete! ✅' as status;
