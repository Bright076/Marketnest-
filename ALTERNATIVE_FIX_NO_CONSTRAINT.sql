-- Alternative Fix: Remove Foreign Key Completely
-- Use this if the main fix doesn't work due to existing data issues

-- Step 1: Check what's currently in orders table
SELECT 
  id,
  product_id,
  pg_typeof(product_id) as product_id_type,
  user_id,
  created_at
FROM orders 
LIMIT 5;

-- Step 2: Drop the foreign key constraint
ALTER TABLE orders 
DROP CONSTRAINT IF EXISTS orders_product_id_fkey;

-- Step 3: Change product_id to UUID (clears invalid data)
-- WARNING: This will set invalid product_ids to NULL
ALTER TABLE orders 
ALTER COLUMN product_id TYPE UUID 
USING CASE 
  WHEN product_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
    THEN product_id::text::uuid
  ELSE NULL
END;

-- Step 4: DON'T recreate foreign key (more flexible)
-- You can manually verify product_id exists in products table in your code

-- Step 5: Add missing columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_country VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_state VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_postal_code VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- Step 6: Clean up any NULL product_ids (optional)
-- DELETE FROM orders WHERE product_id IS NULL;

-- Verify
SELECT 
  table_name,
  column_name,
  data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name = 'product_id';
