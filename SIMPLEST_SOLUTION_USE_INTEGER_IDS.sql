-- SIMPLEST SOLUTION: Make everything use INTEGER IDs
-- This works for both CJ products and any future products

-- Step 1: Check current state
SELECT 
  'Current column types:' as info,
  table_name,
  column_name,
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('products', 'orders') 
  AND column_name IN ('id', 'product_id');

-- Step 2: Count existing data
SELECT 'Existing products:' as info, COUNT(*) as count FROM products
UNION ALL
SELECT 'Existing orders:', COUNT(*) FROM orders;

-- Step 3: Drop foreign key
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_product_id_fkey;

-- Step 4: If products table is empty or has only test data, recreate it
-- UNCOMMENT if you want to start fresh:
-- TRUNCATE TABLE products CASCADE;
-- TRUNCATE TABLE orders CASCADE;

-- Step 5: Change products.id to INTEGER with auto-increment
ALTER TABLE products ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS products_id_seq CASCADE;

ALTER TABLE products ALTER COLUMN id TYPE INTEGER USING 
  CASE 
    WHEN id ~ '^[0-9]+$' THEN id::INTEGER  -- If already integer string
    ELSE ROW_NUMBER() OVER (ORDER BY created_at)  -- Generate sequential ID
  END;

CREATE SEQUENCE products_id_seq;
SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 0) + 1);
ALTER TABLE products ALTER COLUMN id SET DEFAULT nextval('products_id_seq');
ALTER SEQUENCE products_id_seq OWNED BY products.id;

-- Step 6: Change orders.product_id to INTEGER
ALTER TABLE orders ALTER COLUMN product_id TYPE INTEGER USING 
  CASE 
    WHEN product_id IS NULL THEN NULL
    WHEN product_id::text ~ '^[0-9]+$' THEN product_id::text::INTEGER
    ELSE NULL
  END;

-- Step 7: Recreate foreign key
ALTER TABLE orders 
ADD CONSTRAINT orders_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE SET NULL;

-- Step 8: Verify
SELECT 
  'Fixed column types:' as info,
  table_name,
  column_name,
  data_type,
  column_default
FROM information_schema.columns 
WHERE table_name IN ('products', 'orders') 
  AND column_name IN ('id', 'product_id')
ORDER BY table_name, column_name;

-- Expected result:
-- orders    | product_id | integer | NULL
-- products  | id         | integer | nextval('products_id_seq'::regclass)
