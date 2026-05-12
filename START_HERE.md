# 👋 START HERE: Fix Dashboard Issue

## Your Issue
Name and phone not showing on dashboard after signup.

## Root Cause
**Configuration issue in Supabase** (not code issue - your code is correct!)

---

## 🎯 2-Minute Fix

### Fix #1: Disable Email Confirmation
```
1. Open Supabase Dashboard
   → https://yuhevckzxzzkazxickir.supabase.co

2. Click: Authentication → Providers → Email

3. Find: "Confirm email" toggle

4. Turn it OFF (disable it)

5. Click Save
```

### Fix #2: Get Correct API Key
```
1. In Supabase Dashboard
   → Settings → API

2. Find: "anon public" key
   (It's a LONG token starting with "eyJ...")

3. Copy it

4. Open: marketnest/.env.local

5. Replace this line:
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...YOUR_KEY_HERE

6. Save file

7. Restart dev server (Ctrl+C then npm run dev)
```

---

## ✅ Test Your Fix

### Quick Test (Recommended)
```
1. Go to: http://localhost:3000/test-auth

2. Click "Test Signup" button

3. Look at the JSON response

4. Check if you see:
   {
     "user": {
       "user_metadata": {
         "full_name": "Test User",
         "phone": "+234 800 000 0000"
       }
     }
   }

5. If you see metadata → IT WORKS! ✅
```

### Real Test
```
1. Go to Supabase → Authentication → Users
   Delete any old test users

2. Go to: http://localhost:3000/signup

3. Create a new account

4. Should redirect to dashboard

5. Name and phone should display! 🎉
```

---

## 🔍 How to Know It's Fixed

### Before Fix:
```
Dashboard shows:
- Full Name: User
- Phone: N/A
```

### After Fix:
```
Dashboard shows:
- Full Name: John Doe
- Phone: +234 800 000 0000
```

---

## 📚 More Info

- **Quick Guide:** `QUICK_FIX.md`
- **Detailed Guide:** `AUTH_FIX_SUMMARY.md`
- **Troubleshooting:** `AUTH_TROUBLESHOOTING.md`

---

## 🆘 Still Stuck?

1. Open browser console (F12)
2. Go to dashboard
3. Look for: `=== USER DEBUG INFO ===`
4. Check if `user_metadata` is empty or has data
5. If empty → Email confirmation still enabled or wrong key

---

**Remember:** The code is correct. This is just a Supabase configuration issue! 💪
