-- ===========================================
-- DELIVERY INFORMATION SYSTEM SETUP
-- ===========================================
-- Run this SQL in your Supabase SQL Editor

-- Update orders table to include complete delivery information
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_country VARCHAR(100),
ADD COLUMN IF NOT EXISTS customer_state VARCHAR(100),
ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS customer_postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS order_notes TEXT,
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_country ON orders(customer_country);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Update existing orders with default values (if needed)
UPDATE orders 
SET customer_email = COALESCE(customer_email, 'not-provided@example.com'),
    customer_country = COALESCE(customer_country, 'Not specified'),
    customer_state = COALESCE(customer_state, 'Not specified'),
    customer_city = COALESCE(customer_city, 'Not specified'),
    quantity = COALESCE(quantity, 1)
WHERE customer_email IS NULL 
   OR customer_country IS NULL 
   OR customer_state IS NULL 
   OR customer_city IS NULL 
   OR quantity IS NULL;

-- Add comment to table
COMMENT ON COLUMN orders.customer_email IS 'Customer email address for order notifications';
COMMENT ON COLUMN orders.customer_country IS 'Delivery country';
COMMENT ON COLUMN orders.customer_state IS 'Delivery state/province';
COMMENT ON COLUMN orders.customer_city IS 'Delivery city';
COMMENT ON COLUMN orders.customer_postal_code IS 'Postal/ZIP code (optional)';
COMMENT ON COLUMN orders.order_notes IS 'Special delivery instructions from customer';
COMMENT ON COLUMN orders.quantity IS 'Quantity of products ordered';

-- ✅ Setup Complete!
-- Next: Configure email notifications using Resend or similar service
