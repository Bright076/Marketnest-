-- SIMPLEST FIX: Delete all existing orders and start fresh
-- Use this if you don't have important orders to keep

-- ⚠️ WARNING: This will DELETE ALL ORDERS ⚠️
-- Only run this if you're okay losing existing order data

-- Step 1: Check how many orders you have
SELECT COUNT(*) as total_orders FROM orders;

-- Step 2: See what's in orders (optional - review before deleting)
SELECT * FROM orders LIMIT 10;

-- Step 3: DELETE ALL ORDERS (if you're sure)
-- UNCOMMENT THE LINE BELOW TO DELETE
-- DELETE FROM orders;

-- Step 4: Drop the foreign key
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_product_id_fkey;

-- Step 5: Change product_id type to UUID
ALTER TABLE orders ALTER COLUMN product_id TYPE UUID USING NULL;

-- Step 6: Recreate foreign key
ALTER TABLE orders 
ADD CONSTRAINT orders_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE SET NULL;

-- Step 7: Add missing columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_country VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_state VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_postal_code VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- Step 8: Verify everything is fixed
SELECT 
  table_name,
  column_name,
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('products', 'orders') 
  AND column_name IN ('id', 'product_id')
ORDER BY table_name;

-- You should see:
-- orders    | product_id | uuid
-- products  | id         | uuid
