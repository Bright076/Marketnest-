# Fix Both Issues: Refresh Token + Webhook

## Issue 1: Invalid Refresh Token ❌

### Quick Fix (30 seconds):

1. **Open browser console** (Press F12)
2. **Run this code:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```
3. **Login again** at `/login`
4. **Done!** ✅

---

## Issue 2: Webhook Not Working ❌

### Quick Fix (2 minutes):

1. **Open Supabase Dashboard**
   - Go to: https://yuhevckzxzzkazxickir.supabase.co
   - Click: **SQL Editor** (left sidebar)
   - Click: **New Query**

2. **Run the Fix Script**
   - Open file: `SIMPLE_FIX.sql`
   - Copy entire contents
   - Paste into SQL Editor
   - Click: **Run** ▶️

3. **Check Results**
   - Should see: "Setup Complete!" message
   - Should show: trigger_exists = 1, function_exists = 1

4. **Test It**
   - Go to `/signup`
   - Create a new test user
   - Go back to SQL Editor
   - Run: `SELECT * FROM public.profiles;`
   - Should see the new profile! ✅

---

## Verify Everything Works

### Test 1: Check Trigger
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```
**Expected:** 1 row

### Test 2: Check Function
```sql
SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
```
**Expected:** 1 row

### Test 3: Check Profiles
```sql
SELECT * FROM public.profiles;
```
**Expected:** Shows all user profiles

### Test 4: Create New User
1. Go to `/signup`
2. Create test account
3. Run: `SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 1;`
4. Should see new profile immediately! ✅

---

## Common Errors & Solutions

### Error: "relation public.profiles does not exist"
**Solution:** Table not created. Run `SIMPLE_FIX.sql` again.

### Error: "function handle_new_user() does not exist"
**Solution:** Function not created. Run `SIMPLE_FIX.sql` again.

### Error: "permission denied for table profiles"
**Solution:** RLS blocking. Run this:
```sql
GRANT ALL ON public.profiles TO authenticated;
```

### Error: "duplicate key value violates unique constraint"
**Solution:** Profile already exists. This is OK - means trigger worked before!

---

## Still Having Issues?

### Debug Step 1: Check Supabase Logs
1. Go to Supabase Dashboard
2. Click "Logs" in left sidebar
3. Look for errors when you signup

### Debug Step 2: Test Function Manually
```sql
-- Get a user ID
SELECT id, email FROM auth.users LIMIT 1;

-- Try to create profile manually (replace USER_ID)
INSERT INTO public.profiles (id, email, full_name, phone)
VALUES ('USER_ID_HERE', 'test@example.com', 'Test User', '+234 800 000 0000');
```

If this works, trigger is the issue.
If this fails, check the error message.

### Debug Step 3: Check User Metadata
```sql
SELECT id, email, raw_user_meta_data 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 1;
```

Make sure `raw_user_meta_data` contains `full_name` and `phone`.
If empty, signup is not saving metadata correctly.

---

## Summary

✅ **Fix Refresh Token:** Clear browser storage, login again
✅ **Fix Webhook:** Run `SIMPLE_FIX.sql` in Supabase
✅ **Test:** Create new user and check profiles table
✅ **Verify:** Run verification queries

**Both issues should be fixed now!** 🎉

---

## Need More Help?

1. Share the exact error message from Supabase logs
2. Share results of verification queries
3. Check if `raw_user_meta_data` has data during signup
