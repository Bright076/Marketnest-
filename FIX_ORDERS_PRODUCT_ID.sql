-- Fix orders.product_id Type Mismatch
-- This fixes the "invalid input syntax for type uuid: 0" error

-- Step 1: Drop the foreign key constraint
ALTER TABLE orders 
DROP CONSTRAINT IF EXISTS orders_product_id_fkey;

-- Step 2: Change product_id from INTEGER to UUID
ALTER TABLE orders 
ALTER COLUMN product_id TYPE UUID 
USING CASE 
  WHEN product_id = 0 THEN NULL  -- Convert invalid 0 to NULL
  ELSE product_id::text::uuid     -- Keep valid UUIDs
END;

-- Step 3: Recreate the foreign key constraint
ALTER TABLE orders 
ADD CONSTRAINT orders_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE SET NULL;  -- If product deleted, set order.product_id to NULL

-- Step 4: Add missing delivery columns (if they don't exist)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_country VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_state VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_postal_code VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- Verify the change
SELECT 
  table_name,
  column_name,
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('products', 'orders') 
  AND column_name IN ('id', 'product_id')
ORDER BY table_name, column_name;

-- Expected output:
-- orders    | product_id | uuid
-- products  | id         | uuid
