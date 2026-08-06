# ⚠️ URGENT: Database Migration Required

## Issue 1: Order Checkout Failing ❌

**Error**: `could not find the (customer_city) column of (orders)`

**Cause**: Your `orders` table is missing the delivery information columns.

**Fix**: Run this SQL in Supabase SQL Editor NOW:

### 1. Go to Supabase Dashboard
1. Open your project
2. Click "SQL Editor" in left sidebar
3. Click "New Query"

### 2. Copy and Paste This SQL:

```sql
-- Add delivery information columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_country VARCHAR(100),
ADD COLUMN IF NOT EXISTS customer_state VARCHAR(100),
ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS customer_postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS order_notes TEXT,
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_country ON orders(customer_country);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
```

### 3. Click "RUN" button

**Result**: Orders table now has delivery columns. Checkout will work!

---

## Issue 2: Notifications Not Finding Customers ⚠️

**Problem**: Admin notifications page shows "All customers: 0"

**Cause**: Need to check if profiles exist and their roles are set correctly.

**Debug Steps**:

### Step 1: Check Console Logs
1. Go to `/admin/notifications`
2. Open browser console (F12)
3. Look for these logs:
   - 📋 Total profiles found: X
   - 👤 Profile details with roles
   - ✅ Customers found: X

### Step 2: Check Profiles in Supabase
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Open `profiles` table
4. Check:
   - **Do profiles exist?** (Should have rows)
   - **What's in the `role` column?** (Should be `null` or `'user'` for customers, `'admin'` for admins)

### Step 3: If No Profiles Exist
Run this SQL to check auth users:

```sql
-- Check if users exist in auth
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;
```

If users exist in `auth.users` but NOT in `profiles`:
- The signup trigger might not be working
- Manually create profiles or fix the trigger

---

## Issue 3: Cart Showing Across Accounts ✅ FIXED

**What was fixed**:
- Cart is now stored per user ID
- Each user has their own cart
- Logout clears the cart
- Login loads that user's cart

**How it works now**:
- User A's cart: `marketnest_cart_USER_A_ID`
- User B's cart: `marketnest_cart_USER_B_ID`
- Logged out: `marketnest_cart_guest`

**No action needed** - This is deployed and working!

---

## Issue 4: SKU Search ✅ IMPROVED

**What was fixed**:
- Better SKU detection (looks for dashes/underscores)
- Better PID detection (8+ alphanumeric characters)
- More flexible pattern matching

**How to use**:
- **PID**: Paste long alphanumeric code → Exact product
- **SKU**: Paste code with dashes (ABC-123) → Exact product
- **Name**: Type keywords → Related products

**No action needed** - This is deployed!

---

## Priority Actions:

### 🔴 URGENT (Do Now):
1. **Run the orders table SQL** (above) to fix checkout

### 🟡 IMPORTANT (Check Today):
2. **Check notification logs** in browser console at `/admin/notifications`
3. **Verify profiles exist** in Supabase Table Editor

### 🟢 INFO (Already Done):
4. ✅ Cart is now user-specific
5. ✅ SKU search improved
6. ✅ Admin dashboard mobile responsive

---

## Testing Checklist:

After running the SQL:

- [ ] Try placing an order with delivery details
- [ ] Should go to success page (not error)
- [ ] Check Supabase `orders` table - new columns should have data
- [ ] Check admin email (oguchidubem52@gmail.com) for notification
- [ ] Go to `/admin/orders` - should see delivery details
- [ ] Go to `/admin/notifications` - check console for customer count
- [ ] Test cart: logout, login as different user - cart should be separate

---

## Need Help?

If SQL fails, share the error message.
If notifications still show 0 customers, share console logs from `/admin/notifications`.

The main blocker is the missing database columns. Run that SQL first!
