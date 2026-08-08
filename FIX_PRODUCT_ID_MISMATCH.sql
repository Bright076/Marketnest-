-- FINAL FIX: Change products.id from UUID to INTEGER
-- This allows both hardcoded products (1,2,3...) and CJ products to work

-- Step 1: Check current state
SELECT 
  table_name,
  column_name,
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('products', 'orders') 
  AND column_name IN ('id', 'product_id')
ORDER BY table_name;

-- Step 2: Check if you have any products in the products table
SELECT COUNT(*) as total_products, 
       MIN(id) as min_id, 
       MAX(id) as max_id 
FROM products;

-- If products table is EMPTY or has only a few test products, 
-- it's safe to drop and recreate with INTEGER IDs

-- Step 3: Drop foreign key constraints
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_product_id_fkey;

-- Step 4: Change products.id from UUID to INTEGER
-- WARNING: This will fail if you have existing products with UUID IDs
ALTER TABLE products 
ALTER COLUMN id TYPE INTEGER 
USING id::text::integer;

-- Step 5: Change orders.product_id from UUID to INTEGER
ALTER TABLE orders 
ALTER COLUMN product_id TYPE INTEGER 
USING CASE 
  WHEN product_id IS NULL THEN NULL
  ELSE product_id::text::integer
END;

-- Step 6: Recreate foreign key
ALTER TABLE orders 
ADD CONSTRAINT orders_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE SET NULL;

-- Step 7: Verify the fix
SELECT 
  table_name,
  column_name,
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('products', 'orders') 
  AND column_name IN ('id', 'product_id')
ORDER BY table_name;

-- Expected result:
-- orders    | product_id | integer
-- products  | id         | integer
