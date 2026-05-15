# Debug Webhook/Trigger Not Working

## Step-by-Step Debugging

### Step 1: Check if Table Exists

Run in Supabase SQL Editor:
```sql
SELECT * FROM public.profiles;
```

**Expected:** Table exists (might be empty)
**If error:** Table not created - run `supabase-setup.sql` again

---

### Step 2: Check if Trigger Exists

Run in Supabase SQL Editor:
```sql
SELECT 
  tgname as trigger_name,
  tgenabled as enabled
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
```

**Expected:** Shows 1 row with trigger name
**If empty:** Trigger not created - see fix below

---

### Step 3: Check if Function Exists

Run in Supabase SQL Editor:
```sql
SELECT 
  proname as function_name,
  prosrc as function_code
FROM pg_proc 
WHERE proname = 'handle_new_user';
```

**Expected:** Shows function with code
**If empty:** Function not created - see fix below

---

### Step 4: Test Function Manually

First, get a test user ID:
```sql
SELECT id, email, raw_user_meta_data 
FROM auth.users 
LIMIT 1;
```

Then try to manually insert a profile:
```sql
-- Replace 'USER_ID_HERE' with actual user ID from above
INSERT INTO public.profiles (id, email, full_name, phone)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'phone'
FROM auth.users
WHERE id = 'USER_ID_HERE'
ON CONFLICT (id) DO NOTHING;
```

**Expected:** Profile inserted successfully
**If error:** Check error message

---

### Step 5: Check RLS Policies

Run in Supabase SQL Editor:
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles';
```

**Expected:** Shows 2 policies (SELECT and UPDATE)
**If empty:** Policies not created

---

## Common Issues & Fixes

### Issue 1: Trigger Not Created

**Fix:** Run this SQL:
```sql
-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

### Issue 2: Function Not Created

**Fix:** Run this SQL:
```sql
-- Create or replace the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### Issue 3: Table Not Created

**Fix:** Run this SQL:
```sql
-- Create the table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);
```

---

### Issue 4: Permission Error

**Fix:** Grant permissions:
```sql
-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
```

---

### Issue 5: Trigger Fires But Profile Not Created

**Check Supabase Logs:**
1. Go to Supabase Dashboard
2. Click "Logs" in left sidebar
3. Look for errors related to `handle_new_user`

**Common causes:**
- RLS blocking the insert
- Missing data in user_metadata
- Constraint violation (duplicate email)

**Fix:** Temporarily disable RLS for testing:
```sql
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

Then test signup again. If it works, the issue is RLS.

**Re-enable RLS after testing:**
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

---

## Complete Reset (Nuclear Option)

If nothing works, run this to start fresh:

```sql
-- Drop everything
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Now run the entire supabase-setup.sql again
```

---

## Test the Trigger

### Step 1: Create Test User
1. Go to `/signup`
2. Fill in form with test data
3. Click "Create Account"

### Step 2: Check if Profile Created
Run in SQL Editor:
```sql
SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 1;
```

**Expected:** See the new profile with data
**If empty:** Trigger didn't fire - check logs

### Step 3: Check User Metadata
Run in SQL Editor:
```sql
SELECT 
  id,
  email,
  raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 1;
```

**Expected:** See user with metadata containing full_name and phone
**If metadata is empty:** Signup not saving metadata correctly

---

## Verify Complete Setup

Run this comprehensive check:
```sql
-- Check table
SELECT 'Table exists' as check, COUNT(*) as count FROM public.profiles;

-- Check trigger
SELECT 'Trigger exists' as check, COUNT(*) as count 
FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Check function
SELECT 'Function exists' as check, COUNT(*) as count 
FROM pg_proc WHERE proname = 'handle_new_user';

-- Check policies
SELECT 'Policies exist' as check, COUNT(*) as count 
FROM pg_policies WHERE tablename = 'profiles';

-- Check users vs profiles
SELECT 
  'Users' as type, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 
  'Profiles' as type, COUNT(*) as count FROM public.profiles;
```

**Expected:**
- Table exists: 1
- Trigger exists: 1
- Function exists: 1
- Policies exist: 2
- Users count = Profiles count

---

## Still Not Working?

1. **Share the error message** from Supabase logs
2. **Check if user_metadata is being saved** during signup
3. **Verify Supabase project URL** is correct
4. **Try creating profile manually** to isolate the issue

---

## Quick Test Script

Run this to test everything at once:
```sql
-- Test 1: Check setup
SELECT 'Setup Check' as test;
SELECT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles') as table_exists;
SELECT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') as trigger_exists;
SELECT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') as function_exists;

-- Test 2: Check data
SELECT 'Data Check' as test;
SELECT COUNT(*) as total_users FROM auth.users;
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- Test 3: Check missing profiles
SELECT 'Missing Profiles' as test;
SELECT u.id, u.email, u.raw_user_meta_data
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
```

This will show you exactly what's missing!
