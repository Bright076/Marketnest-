# Authentication Troubleshooting Guide

## Issue: User name and phone not showing on dashboard

### Possible Causes & Solutions

#### 1. **Email Confirmation Enabled in Supabase**
**Problem:** Supabase requires email confirmation by default. Until the user confirms their email, the session isn't fully established and metadata may not persist.

**Solution:**
1. Go to your Supabase Dashboard: https://yuhevckzxzzkazxickir.supabase.co
2. Navigate to: **Authentication** → **Providers** → **Email**
3. Find the setting: **"Confirm email"**
4. **Disable** this setting for testing
5. Save changes

#### 2. **Wrong Anon Key Format**
**Problem:** Your anon key looks like `sb_publishable_x75YQhpYobjzfb3BiqUBZg_oO4wcedE` but Supabase anon keys typically start with `eyJ...`

**Solution:**
1. Go to your Supabase Dashboard
2. Navigate to: **Settings** → **API**
3. Copy the **anon/public** key (should be a long JWT token starting with `eyJ`)
4. Update `.env.local` with the correct key:
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. Restart your dev server

#### 3. **Testing Steps**

After making the above changes:

1. **Clear existing test data:**
   - Go to Supabase Dashboard → Authentication → Users
   - Delete any test users you created

2. **Test signup flow:**
   - Open browser console (F12)
   - Go to `/signup`
   - Fill in the form with test data
   - Click "Create Account"
   - Check console logs for "Signup response:" - should show user object with metadata

3. **Check dashboard:**
   - After signup, you should be redirected to `/dashboard`
   - Check console logs for "=== USER DEBUG INFO ===" 
   - Verify that `user_metadata` contains `full_name` and `phone`

4. **If metadata is empty:**
   - The issue is likely email confirmation or wrong API key
   - Follow solutions #1 and #2 above

#### 4. **Manual Verification in Supabase**

1. Go to Supabase Dashboard → Authentication → Users
2. Click on a user you created
3. Check the **"User Metadata"** section
4. You should see:
   ```json
   {
     "full_name": "John Doe",
     "phone": "+234 800 000 0000"
   }
   ```
5. If this is empty, the metadata isn't being saved during signup

### Current Implementation

The code is correctly:
- ✅ Saving metadata during signup via `options.data`
- ✅ Reading metadata on dashboard via `user.user_metadata`
- ✅ Handling loading states
- ✅ Checking for authentication

The issue is likely **configuration** in Supabase, not the code.

### Quick Fix Checklist

- [ ] Disable email confirmation in Supabase
- [ ] Verify correct anon key (should start with `eyJ`)
- [ ] Restart dev server after changing `.env.local`
- [ ] Delete old test users
- [ ] Create new test user
- [ ] Check browser console for debug logs
- [ ] Verify metadata in Supabase dashboard

### Need More Help?

If the issue persists after following these steps, check:
1. Browser console for any error messages
2. Supabase Dashboard → Logs for API errors
3. Network tab to see the actual API requests/responses
