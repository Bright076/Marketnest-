# 🔧 All SQL Fixes Needed - Run These in Order

Run these in Supabase SQL Editor:

## 1. Fix Orders Table - Add Delivery Columns
```sql
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_country VARCHAR(100),
ADD COLUMN IF NOT EXISTS customer_state VARCHAR(100),
ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS customer_postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS order_notes TEXT,
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
```

## 2. Fix Notifications Table - Add RLS Policies
```sql
-- Allow users to update their own notifications (mark as read)
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

CREATE POLICY "Users can update own notifications"
ON notifications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow users to delete their own notifications
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;

CREATE POLICY "Users can delete own notifications"
ON notifications
FOR DELETE
TO authenticated
USING (user_id = auth.uid());
```

## 3. Check Product ID Type (Run this to see the issue)
```sql
-- Check what type product_id is in orders table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('id', 'product_id');

-- Check what type id is in products table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'id';
```

**After running this, tell me what data types you see!**

The error "invalid input syntax for type uuid: n 3" means:
- Either `product_id` in orders is UUID but products.id is INTEGER
- OR products are being stored with integer IDs but orders expects UUID

We need to see the data types to fix this properly.

---

## After Running All SQL:

1. ✅ Checkout will work (delivery columns exist)
2. ✅ Mark as read button will work (RLS policy allows updates)
3. ✅ Delete button will work (RLS policy allows deletes)
4. ⚠️ Order creation - Need to check product ID types first

Run the SQLs in order 1, 2, 3 and tell me the results!
