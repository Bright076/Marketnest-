-- NUCLEAR OPTION: Delete everything and start fresh
-- Use this if you want to reset and start testing from scratch

-- ⚠️ WARNING: This deletes ALL products and orders! ⚠️

-- Step 1: See what you have
SELECT 'Products:' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Orders:', COUNT(*) FROM orders;

-- Step 2: DELETE EVERYTHING (uncomment to execute)
-- DELETE FROM orders;
-- DELETE FROM products;

-- Step 3: Drop constraints
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_product_id_fkey;

-- Step 4: Change products.id to INTEGER
ALTER TABLE products ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS products_id_seq CASCADE;
ALTER TABLE products ALTER COLUMN id TYPE INTEGER USING 1;
CREATE SEQUENCE products_id_seq START 1;
ALTER TABLE products ALTER COLUMN id SET DEFAULT nextval('products_id_seq');
ALTER SEQUENCE products_id_seq OWNED BY products.id;

-- Step 5: Change orders.product_id to INTEGER  
ALTER TABLE orders 
ALTER COLUMN product_id TYPE INTEGER 
USING NULL;

-- Step 6: Recreate foreign key
ALTER TABLE orders 
ADD CONSTRAINT orders_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE SET NULL;

-- Step 7: Verify
SELECT 
  table_name,
  column_name,
  data_type,
  column_default
FROM information_schema.columns 
WHERE table_name IN ('products', 'orders') 
  AND column_name IN ('id', 'product_id')
ORDER BY table_name;

-- You should see:
-- orders    | product_id | integer | NULL
-- products  | id         | integer | nextval('products_id_seq'::regclass)
