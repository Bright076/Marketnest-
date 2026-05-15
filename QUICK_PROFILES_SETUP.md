# Quick Profiles Table Setup

## 🚀 3-Step Setup

### Step 1: Open Supabase SQL Editor
1. Go to: https://yuhevckzxzzkazxickir.supabase.co
2. Click: **SQL Editor** (left sidebar)
3. Click: **New Query**

### Step 2: Copy & Run SQL
1. Open: `supabase-setup.sql` in this project
2. Copy the entire file
3. Paste into SQL Editor
4. Click: **Run** ▶️

### Step 3: Test It
1. Go to: `http://localhost:3000/signup`
2. Create a new test account
3. Go back to Supabase → SQL Editor
4. Run: `SELECT * FROM public.profiles;`
5. You should see your new profile! ✅

---

## What This Does

✅ Creates `profiles` table
✅ Automatically adds users to profiles when they sign up
✅ Syncs data from `user_metadata` to profiles table
✅ Enables security (users can only see their own profile)
✅ Backfills existing users

---

## How It Works

```
User Signs Up
     ↓
Supabase Auth creates user
     ↓
Trigger fires automatically
     ↓
Profile created in profiles table
     ↓
Done! ✅
```

---

## Verify Setup

Run this in SQL Editor:
```sql
-- Check if table exists
SELECT * FROM public.profiles;

-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Count profiles
SELECT COUNT(*) FROM public.profiles;
```

---

## Profiles Table Structure

```
profiles
├── id (UUID) - Links to auth.users
├── email (TEXT)
├── full_name (TEXT)
├── phone (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## Security (RLS)

✅ Users can view their own profile
✅ Users can update their own profile
❌ Users cannot see other users' profiles
❌ Users cannot update other users' profiles

---

## That's It!

No code changes needed. The trigger handles everything automatically! 🎉

**Read `PROFILES_TABLE_SETUP.md` for detailed documentation.**
