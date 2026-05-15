# 🔧 Fix: Invalid Refresh Token Error

## Error Message
```
AuthApiError: Invalid Refresh Token: Refresh Token Not Found
```

## What Causes This?
This error occurs when:
- Old/expired refresh token is stored in browser
- Session data is corrupted
- You switched Supabase projects
- Browser storage has stale data

---

## ✅ Quick Fixes (Choose One)

### Option 1: Use Clear Session Page (Easiest)
1. Go to: `http://localhost:3000/clear-session`
2. Wait for "Session Cleared!" message
3. You'll be redirected to home
4. Try logging in again

### Option 2: Clear Browser Storage Manually
1. **Open DevTools:**
   - Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
   - Or `Cmd+Option+I` (Mac)

2. **Go to Application Tab:**
   - Click "Application" (Chrome) or "Storage" (Firefox)

3. **Clear Local Storage:**
   - Find "Local Storage" in left sidebar
   - Click on `http://localhost:3000`
   - Right-click → "Clear"
   - Or delete these keys:
     - `supabase.auth.token`
     - `sb-*` (any keys starting with sb-)

4. **Refresh page** and try again

### Option 3: Use Incognito/Private Window
1. Open new incognito/private window
2. Go to `http://localhost:3000`
3. Login fresh (no cached tokens)

### Option 4: Clear All Browser Data
1. **Chrome:**
   - Settings → Privacy → Clear browsing data
   - Select "Cookies and other site data"
   - Select "Cached images and files"
   - Click "Clear data"

2. **Firefox:**
   - Settings → Privacy → Clear Data
   - Select "Cookies and Site Data"
   - Select "Cached Web Content"
   - Click "Clear"

---

## 🔍 Verify Fix

After clearing:
1. Go to `http://localhost:3000`
2. Click "Login"
3. Enter credentials
4. Should login successfully without error

---

## 🛡️ Prevent Future Issues

### 1. Always Logout Properly
Don't just close the browser - use the logout button

### 2. Don't Mix Environments
If testing multiple Supabase projects, use different browsers or incognito

### 3. Clear Storage When Switching Projects
If you change Supabase URL/keys, clear storage first

---

## 🔧 What Was Fixed

### Updated Supabase Client
**File:** `lib/supabaseClient.ts`

Added:
- Better session detection
- Explicit storage configuration
- Helper function to clear invalid sessions

### Created Clear Session Page
**URL:** `/clear-session`

Features:
- Automatically signs out
- Clears all storage
- Redirects to home
- Visual feedback

---

## 📝 Manual Clear (If Needed)

If automatic clearing doesn't work, run this in browser console:

```javascript
// Clear Supabase session
localStorage.clear();
sessionStorage.clear();

// Reload page
window.location.reload();
```

---

## 🐛 Still Having Issues?

### Check Environment Variables
Make sure `.env.local` has correct values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://yuhevckzxzzkazxickir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Restart Dev Server
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### Check Supabase Dashboard
1. Go to: https://yuhevckzxzzkazxickir.supabase.co
2. Check Authentication → Users
3. Verify your user exists
4. Check if email is confirmed

### Create New Account
If all else fails:
1. Clear all storage
2. Go to `/signup`
3. Create new account with different email
4. Test if it works

---

## ✅ Solution Summary

**Immediate Fix:**
1. Go to `/clear-session` OR
2. Clear browser local storage OR
3. Use incognito window

**Long-term:**
- Always logout properly
- Don't mix environments
- Clear storage when switching projects

---

## 🎯 Quick Commands

### Clear Session via URL
```
http://localhost:3000/clear-session
```

### Clear via Console
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Check Current Session
```javascript
// In browser console
console.log(localStorage.getItem('supabase.auth.token'));
```

---

**Status:** ✅ Fixed with clear-session page and improved error handling
**Last Updated:** May 14, 2026
