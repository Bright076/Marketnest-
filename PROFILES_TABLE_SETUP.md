# Profiles Table Setup with Automatic Trigger

## Overview

This setup creates a `profiles` table that automatically syncs with Supabase Auth when users sign up. The trigger extracts data from `user_metadata` and stores it in a dedicated profiles table.

## Benefits

✅ **Automatic Sync** - Profile created automatically on signup
✅ **Better Queries** - Easy to query user data with SQL
✅ **Scalability** - Better for large user bases
✅ **Relationships** - Can link profiles to orders, reviews, etc.
✅ **RLS Security** - Users can only see/edit their own profile

## Setup Instructions

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://yuhevckzxzzkazxickir.supabase.co
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Setup SQL

Copy the entire contents of `supabase-setup.sql` and paste it into the SQL editor, then click **Run**.

The SQL will:
1. ✅ Create `profiles` table
2. ✅ Enable Row Level Security (RLS)
3. ✅ Create RLS policies (users can view/edit own profile)
4. ✅ Create trigger function to handle new users
5. ✅ Create trigger to auto-create profiles on signup
6. ✅ Backfill existing users (if any)

### Step 3: Verify Setup

Run this query to check if the table was created:

```sql
SELECT * FROM public.profiles;
```

You should see the profiles table (might be empty if no users yet).

### Step 4: Test the Trigger

1. Go to your app: `http://localhost:3000/signup`
2. Create a new test account
3. Go back to Supabase SQL Editor
4. Run: `SELECT * FROM public.profiles;`
5. You should see the new user's profile! ✅

## How It Works

### Signup Flow:

```
User fills signup form
        ↓
Supabase Auth creates user in auth.users
        ↓
Trigger detects new user
        ↓
Extracts data from user_metadata
        ↓
Creates profile in public.profiles
        ↓
User can now login and use the app
```

### Database Structure:

```sql
auth.users (Supabase managed)
├── id (UUID)
├── email
├── raw_user_meta_data
│   ├── full_name
│   └── phone
└── ...

public.profiles (Your table)
├── id (UUID) → references auth.users(id)
├── email
├── full_name
├── phone
├── created_at
└── updated_at
```

### Trigger Function:

```sql
CREATE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract data from user_metadata and insert into profiles
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Row Level Security (RLS)

### Policy 1: View Own Profile
```sql
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);
```

**What it does:** Users can only see their own profile data.

### Policy 2: Update Own Profile
```sql
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);
```

**What it does:** Users can only update their own profile data.

## Querying Profiles

### Get Current User's Profile:

```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();
```

### Update Current User's Profile:

```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({ 
    full_name: 'New Name',
    phone: '+234 800 000 0000'
  })
  .eq('id', user.id);
```

### Get All Users (Admin Only):

```typescript
// Note: This requires admin privileges or custom RLS policy
const { data: profiles } = await supabase
  .from('profiles')
  .select('*');
```

## Updating Your Code (Optional)

If you want to use the profiles table instead of user_metadata, update your dashboard:

### Before (using user_metadata):
```typescript
const fullName = user?.user_metadata?.full_name || "User";
const phone = user?.user_metadata?.phone || "N/A";
```

### After (using profiles table):
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

const fullName = profile?.full_name || "User";
const phone = profile?.phone || "N/A";
```

## Troubleshooting

### Issue 1: Trigger Not Working

**Check if trigger exists:**
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

**Recreate trigger:**
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Issue 2: Existing Users Not in Profiles

**Backfill existing users:**
```sql
INSERT INTO public.profiles (id, email, full_name, phone)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'phone'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
```

### Issue 3: Permission Denied

**Check RLS policies:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

**Disable RLS temporarily (for testing only):**
```sql
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

**Re-enable RLS:**
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### Issue 4: Profile Not Created on Signup

**Check if function exists:**
```sql
SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
```

**Test function manually:**
```sql
-- Get a user ID
SELECT id, email FROM auth.users LIMIT 1;

-- Try to insert profile manually
INSERT INTO public.profiles (id, email, full_name, phone)
VALUES ('user-id-here', 'test@example.com', 'Test User', '+234 800 000 0000');
```

## Verification Checklist

After running the setup SQL:

- [ ] Table created: `SELECT * FROM public.profiles;`
- [ ] RLS enabled: Check in Supabase Dashboard → Database → Tables → profiles
- [ ] Policies created: Check in Supabase Dashboard → Authentication → Policies
- [ ] Trigger created: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- [ ] Function created: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`
- [ ] Test signup: Create new user and check if profile appears
- [ ] Existing users backfilled: `SELECT COUNT(*) FROM public.profiles;`

## Next Steps

1. **Run the SQL** in Supabase SQL Editor
2. **Test signup** - Create a new user
3. **Verify** - Check if profile was created automatically
4. **(Optional)** Update your code to use profiles table instead of user_metadata

## Summary

✅ **Profiles table created**
✅ **Automatic trigger setup**
✅ **RLS security enabled**
✅ **Existing users backfilled**
✅ **Ready to use!**

When users sign up, their profile is automatically created in the `profiles` table with data from `user_metadata`. No code changes needed - it works automatically! 🎉
