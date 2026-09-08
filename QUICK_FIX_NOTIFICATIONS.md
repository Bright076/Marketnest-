# ⚡ QUICK FIX: Notifications Error

## 🔴 Error You're Seeing
```
null value in column "user_id" of relation "notifications" violates not-null constraint
```

## ✅ How to Fix (2 minutes)

### Step 1: Open Supabase
Go to: https://supabase.com/dashboard/project/yuhevckzxzzkazxickir/sql/new

### Step 2: Copy This SQL
Open the file `DATABASE_FIX_GUEST_NOTIFICATIONS.sql` and copy all the SQL.

### Step 3: Run It
Paste in Supabase SQL Editor and click **"Run"**

### Step 4: Test
Try guest checkout again - should work perfectly now! ✅

## 🎯 What This Does

Updates the database triggers to skip creating notifications for guest orders (since guests don't have user_id).

- ✅ Guest orders: No notification (expected)
- ✅ Logged-in users: Notifications work as before

## 📊 Result

**Before:**
```
Guest checkout → Error: null value in user_id
```

**After:**
```
Guest checkout → Success! (no notification created)
Logged-in checkout → Success! (notification created)
```

---

**Just run the SQL and you're done!** 🚀
