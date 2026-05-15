# Fix: Invalid Refresh Token Error

## The Problem
Error: "Invalid Refresh Token: Refresh Token Not Found"

This happens when:
- Browser storage has corrupted session data
- You changed Supabase keys
- Session expired or was invalidated

## Quick Fix

### Step 1: Clear Browser Storage
Open browser console (F12) and run:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Step 2: Login Again
1. Go to `/login`
2. Login with your credentials
3. Should work now! ✅

## Alternative: Clear Storage Manually

### Chrome/Edge:
1. Press F12 (Developer Tools)
2. Go to "Application" tab
3. Left sidebar → Storage → Local Storage
4. Right-click → Clear
5. Left sidebar → Storage → Session Storage
6. Right-click → Clear
7. Refresh page

### Firefox:
1. Press F12 (Developer Tools)
2. Go to "Storage" tab
3. Local Storage → Right-click → Delete All
4. Session Storage → Right-click → Delete All
5. Refresh page

## Prevent This Error

Add this to your logout function to properly clear storage:

```typescript
const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    localStorage.clear(); // Clear all storage
    sessionStorage.clear();
    router.push("/login");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
```

## If Error Persists

1. **Check Supabase Keys**
   - Verify `.env.local` has correct keys
   - Restart dev server

2. **Try Incognito Mode**
   - Open incognito/private window
   - Test login there

3. **Check Supabase Dashboard**
   - Go to Authentication → Users
   - Verify your user exists
   - Check if email is confirmed

## Summary
✅ Clear localStorage and sessionStorage
✅ Refresh page
✅ Login again
✅ Should work now!
