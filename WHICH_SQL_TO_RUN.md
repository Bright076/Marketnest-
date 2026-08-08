# Which SQL File Should You Run?

You got this error:
```
foreign key constraint "orders_product_id_fkey" cannot be implemented
Key columns "product_id" and "id" are of incompatible types: integer and uuid
```

This means:
- `products.id` is **UUID** 
- `orders.product_id` is **INTEGER**
- They don't match, and there's a foreign key preventing the change

---

## Choose Your Fix:

### 🥇 **OPTION 1: FIX_ORDERS_PRODUCT_ID.sql** (Try This First)

**Best if:** You have no orders yet, or orders with valid product UUIDs

**What it does:**
- Drops foreign key
- Converts `product_id` from INTEGER to UUID
- Recreates foreign key
- Adds missing delivery columns

**Run this file:** `FIX_ORDERS_PRODUCT_ID.sql`

✅ **Try this first!**

---

### 🥈 **OPTION 2: ALTERNATIVE_FIX_NO_CONSTRAINT.sql** (If Option 1 Fails)

**Best if:** You have orders with integer product_ids that can't convert

**What it does:**
- Drops foreign key
- Converts `product_id` to UUID (sets invalid ones to NULL)
- Does NOT recreate foreign key (more flexible)
- Adds missing delivery columns

**Run this file:** `ALTERNATIVE_FIX_NO_CONSTRAINT.sql`

⚠️ Orders with invalid product_ids will have NULL

---

### 🥉 **OPTION 3: SIMPLEST_FIX_DELETE_ORDERS.sql** (Nuclear Option)

**Best if:** You're okay deleting all existing orders and starting fresh

**What it does:**
- **DELETES ALL ORDERS** (you have to uncomment the DELETE line)
- Drops foreign key
- Converts `product_id` to UUID
- Recreates foreign key
- Adds missing delivery columns

**Run this file:** `SIMPLEST_FIX_DELETE_ORDERS.sql`

⚠️ **WARNING:** This deletes all your orders! Only use if you're testing.

---

## How to Run:

1. Go to **Supabase Dashboard**
2. Click **SQL Editor** (left sidebar)
3. Open the SQL file you chose
4. Copy ALL the SQL
5. Paste into Supabase SQL Editor
6. Click **Run**

---

## After Running SQL:

1. **Clear your browser cache/localStorage:**
   ```javascript
   localStorage.clear();
   location.reload();
   ```

2. **Go to your site** and test checkout:
   - Add products to cart
   - Go to checkout
   - Fill delivery details
   - Click "Place Test Order"
   - Should work now! ✅

---

## Still Getting Errors?

Run this to see your current setup:
```sql
SELECT 
  table_name,
  column_name,
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('products', 'orders') 
  AND column_name IN ('id', 'product_id')
ORDER BY table_name;
```

**Expected Result:**
```
orders    | product_id | uuid
products  | id         | uuid
```

If they don't match, let me know what you see!

---

## Quick Decision Tree:

**Do you have any real orders you want to keep?**
- ❌ No → Use **OPTION 3** (Simplest - Delete All)
- ✅ Yes → Use **OPTION 1** (Try to convert)
  - If OPTION 1 fails → Use **OPTION 2** (No foreign key)

---

## My Recommendation:

Since you're testing, I recommend **OPTION 3** (delete all orders and start fresh). It's the cleanest solution.

But if you have real customer orders, try **OPTION 1** first, then **OPTION 2** if it fails.
