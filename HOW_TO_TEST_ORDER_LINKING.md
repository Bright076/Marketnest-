# 🔗 How to Test Guest Order Linking

## The Issue
Guest orders aren't showing in "My Orders" after registering.

## Possible Causes

### 1. Service Role Key Missing in Vercel ⚠️
The `/api/link-guest-orders` route needs `SUPABASE_SERVICE_ROLE_KEY` in Vercel.

**Check:**
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Look for `SUPABASE_SERVICE_ROLE_KEY`
4. If missing, add it:
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1aGV2Y2t6eHp6a2F6eGlja2lyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODM1ODkxNCwiZXhwIjoyMDkzOTM0OTE0fQ.tB1SHpIiUfg2a-R9pxMzXUYw38xOnhsKo6PgmMGOv9I
   ```
5. Redeploy after adding

### 2. Email Mismatch
The order email must EXACTLY match signup email (case-sensitive).

### 3. Orders Already Linked
If you tested with the same email before, orders might already be linked to another account.

## How to Test Properly

### Step 1: Place Guest Order
1. Open site in incognito
2. **Use a unique email**: `test123@example.com`
3. Complete checkout
4. Note the order ID from Telegram notification

### Step 2: Check Order in Database
Go to Supabase → orders table → find your order:
- `user_id` should be `NULL`
- `customer_email` should be `test123@example.com`

### Step 3: Sign Up
1. Click signup link from confirmation page
2. **Use EXACT same email**: `test123@example.com`
3. Complete signup
4. Watch browser console for logs:
   ```
   🔗 Attempting to link guest orders for email: test123@example.com
   🔗 Link API response: {success: true, ordersLinked: 1}
   ✅ Successfully linked 1 guest orders to new account
   ```

### Step 4: Verify in Database
Go to Supabase → orders table → find your order:
- `user_id` should now be the new user's UUID
- `customer_email` still `test123@example.com`

### Step 5: Check "My Orders"
1. Go to dashboard → My Orders
2. Should see the linked order ✅

## Debugging Steps

### Check Browser Console
After signup, you should see:
```
🔗 Attempting to link guest orders for email: your@email.com
🔗 Link API response: {success: true, message: "...", ordersLinked: 1, orders: [...]}
✅ Successfully linked 1 guest orders to new account
```

### Check Vercel Function Logs
1. Vercel Dashboard → Deployments → Latest
2. Functions → `/api/link-guest-orders`
3. Look for logs showing orders being updated

### Check Network Tab
1. F12 → Network tab
2. After signup, find `/api/link-guest-orders` request
3. Check response:
   - Status should be 200
   - Response: `{success: true, ordersLinked: 1}`

### Manual SQL Check
Run this in Supabase SQL Editor:
```sql
-- Find guest orders by email
SELECT id, user_id, customer_email, customer_name, created_at
FROM orders
WHERE customer_email = 'test123@example.com'
ORDER BY created_at DESC;
```

Should show:
- Before signup: `user_id = NULL`
- After signup: `user_id = <some-uuid>`

### Test API Directly
```bash
# Replace with your values
curl -X POST https://your-site.vercel.app/api/link-guest-orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid-here",
    "email": "test123@example.com"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Successfully linked 1 orders to your account",
  "ordersLinked": 1,
  "orders": [...]
}
```

## Common Issues & Solutions

### Issue 1: "No orders found to link"
**Cause:** Email doesn't match or orders already linked  
**Solution:** 
- Verify email matches exactly
- Check if orders have `user_id = NULL` in database

### Issue 2: API returns error
**Cause:** Missing service role key  
**Solution:**
- Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel
- Redeploy

### Issue 3: Orders linked but not showing
**Cause:** Cache or RLS issue  
**Solution:**
- Refresh page
- Logout and login again
- Clear browser cache

### Issue 4: 500 error from API
**Cause:** Service role key invalid or missing  
**Solution:**
- Verify key in Vercel matches Supabase
- Check Vercel function logs for exact error

## Quick Test Script

Run this in browser console after signup:
```javascript
// Check if orders were linked
const userId = (await supabase.auth.getUser()).data.user?.id;
const email = (await supabase.auth.getUser()).data.user?.email;

console.log('User ID:', userId);
console.log('Email:', email);

// Fetch orders
const { data: orders } = await supabase
  .from('orders')
  .select('*')
  .eq('user_id', userId);

console.log('Orders found:', orders?.length || 0);
console.log('Orders:', orders);
```

## Success Checklist

- [ ] Guest order created with `user_id = NULL`
- [ ] Guest order has correct email
- [ ] Service role key in Vercel
- [ ] Signup with exact same email
- [ ] Console shows "Successfully linked X orders"
- [ ] Database shows order now has `user_id` (not NULL)
- [ ] "My Orders" page shows the order
- [ ] No errors in console or Vercel logs

## Still Not Working?

1. Share browser console screenshot after signup
2. Share Vercel function logs for `/api/link-guest-orders`
3. Share SQL query result showing order `user_id` before/after
4. Verify service role key is in Vercel environment variables

The most common issue is **missing service role key in Vercel**! ⚠️
