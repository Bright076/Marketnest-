# Checkout UUID Error Fix

## Problem
Error: `"Failed to create order: invalid input syntax for type uuid: "0""`

This happens when:
1. Your cart contains products with invalid IDs (0, null, undefined)
2. Old cart data from before database changes
3. Products with numeric IDs but database expects UUID

## Solution

### Option 1: Clear Your Cart (Quickest)
1. Open browser console (F12)
2. Run this command:
```javascript
localStorage.clear();
location.reload();
```
3. Re-add products to cart from the products page

### Option 2: Clear Specific Cart Keys
```javascript
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('marketnest_cart_')) {
    localStorage.removeItem(key);
    console.log('Cleared:', key);
  }
});
location.reload();
```

### Option 3: Inspect Cart Data
```javascript
// See what's in your cart
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('marketnest_cart_')) {
    console.log(key, JSON.parse(localStorage.getItem(key)));
  }
});
```

## Root Cause

Your `products` table likely has:
- **INTEGER** IDs (1, 2, 3...) for local products
- **UUID** IDs for CJ imported products

But your `orders` table has:
- **UUID** type for `product_id` column

This mismatch causes the error.

## Permanent Fix Needed

You need to decide:

### Option A: Change orders.product_id to INTEGER
```sql
-- In Supabase SQL Editor
ALTER TABLE orders 
ALTER COLUMN product_id TYPE INTEGER USING product_id::text::integer;
```

**Pro**: Simpler, works with your current products (IDs 1-60)
**Con**: CJ products might need string PID stored elsewhere

### Option B: Change products.id to UUID
```sql
-- More complex - need to migrate data
-- Not recommended if you have existing orders
```

### Option C: Use product_sku or product_name
Store product reference differently in orders table.

##  Recommended Solution

**For Now**: Clear cart and re-add items (Option 1 above)

**Long Term**: Run this SQL to check your column types:
```sql
SELECT 
  table_name,
  column_name,
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('products', 'orders') 
  AND column_name IN ('id', 'product_id');
```

Then decide if you want INTEGER or UUID based on results.

## Testing After Fix

1. Clear cart completely
2. Add 1-2 products from products page
3. Go to checkout
4. Fill delivery details
5. Click "Place Test Order"
6. Should work now!

## Need Help?

Check browser console for:
- `📦 Processing cart item:` - shows what's in cart
- `❌ Invalid product ID:` - shows the problem item

The console logs will tell you exactly which product has ID = 0.
