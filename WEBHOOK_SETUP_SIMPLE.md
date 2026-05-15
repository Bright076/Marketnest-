# Simple Webhook Setup (Code-Based Solution)

## What I Created:

✅ **`lib/createProfile.ts`** - Helper functions to create/read/update profiles
✅ **Updated `app/signup/page.tsx`** - Automatically creates profile on signup
✅ **`CREATE_PROFILES_TABLE.sql`** - SQL to create the profiles table

---

## How It Works Now:

```
User Signs Up
     ↓
Supabase Auth creates user
     ↓
Your code automatically calls createUserProfile()
     ↓
Profile created in profiles table
     ↓
Done! ✅
```

**No database trigger needed!** Your code handles it.

---

## Setup (One-Time Only):

### Step 1: Create the Profiles Table

1. Go to: https://yuhevckzxzzkazxickir.supabase.co
2. Click: **SQL Editor** (left sidebar)
3. Click: **New Query**
4. Open file: `CREATE_PROFILES_TABLE.sql`
5. Copy ALL the code
6. Paste in SQL Editor
7. Click: **Run** ▶️
8. Should see: "Profiles table created successfully!"

**That's it! You only do this ONCE.**

---

## Step 2: Test It

1. Go to: `http://localhost:3000/signup`
2. Create a new test account
3. Check browser console (F12) - should see: "✅ Profile created successfully!"
4. Go back to Supabase SQL Editor
5. Run: `SELECT * FROM profiles;`
6. You should see your new profile! ✅

---

## How to Use the Helper Functions:

### Create Profile (Already done in signup):
```typescript
import { createUserProfile } from "@/lib/createProfile";

const result = await createUserProfile({
  id: user.id,
  email: user.email,
  full_name: "John Doe",
  phone: "+234 800 000 0000",
});
```

### Get Profile:
```typescript
import { getUserProfile } from "@/lib/createProfile";

const result = await getUserProfile(user.id);
if (result.success) {
  console.log(result.data); // Profile data
}
```

### Update Profile:
```typescript
import { updateUserProfile } from "@/lib/createProfile";

const result = await updateUserProfile(user.id, {
  full_name: "New Name",
  phone: "+234 900 000 0000",
});
```

---

## Advantages of This Approach:

✅ **No database triggers needed** - Everything in your code
✅ **Easy to debug** - See console logs
✅ **Full control** - You decide when to create profiles
✅ **Works immediately** - No waiting for triggers
✅ **Simple** - Just JavaScript/TypeScript

---

## Files Modified:

1. ✅ `lib/createProfile.ts` - NEW helper file
2. ✅ `app/signup/page.tsx` - Updated to create profile automatically
3. ✅ `CREATE_PROFILES_TABLE.sql` - SQL to run once in Supabase

---

## Troubleshooting:

### Error: "relation profiles does not exist"
**Solution:** You didn't run `CREATE_PROFILES_TABLE.sql` in Supabase yet.

### Error: "permission denied for table profiles"
**Solution:** RLS policies not created. Run `CREATE_PROFILES_TABLE.sql` again.

### Profile not created but no error
**Solution:** Check browser console for logs. The function might be failing silently.

### Error: "duplicate key value"
**Solution:** Profile already exists. This is OK! The code handles it.

---

## Summary:

1. ✅ Run `CREATE_PROFILES_TABLE.sql` in Supabase (one time only)
2. ✅ Signup code now automatically creates profiles
3. ✅ No database triggers needed
4. ✅ Everything works in your code

**This is much simpler than database triggers!** 🎉
