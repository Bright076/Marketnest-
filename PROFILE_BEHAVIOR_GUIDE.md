# 👤 Profile Icon Behavior Guide

## 🎯 Quick Reference

### Profile Icon in Navbar

```
┌─────────────────────────────────────────────────────────┐
│  Not Logged In:                                         │
│  Icon: 👤 (Gray profile icon)                          │
│  Click → /login                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Regular User (role='user'):                            │
│  Icon: 🟢 (Green avatar with first letter)             │
│  Click → /dashboard (User Dashboard)                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Admin (role='admin'):                                  │
│  Icon: 🔴 (Red avatar with first letter)               │
│  Click → /admin (Admin Dashboard)                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete User Flows

### Flow 1: Not Logged In User
```
User visits site
    ↓
Sees gray profile icon 👤
    ↓
Clicks profile icon
    ↓
Redirected to /login
    ↓
Logs in
    ↓
Role checked:
    ├─ role='user' → Green avatar 🟢 → /dashboard
    └─ role='admin' → Red avatar 🔴 → /admin
```

### Flow 2: Regular User
```
User logs in (role='user')
    ↓
Profile icon turns green 🟢
    ↓
Clicks profile icon
    ↓
Goes to /dashboard
    ↓
Sees user dashboard:
    - Profile information
    - Shop products link
    - View cart link
    - Back to home link
```

### Flow 3: Admin User
```
Admin logs in (role='admin')
    ↓
Profile icon turns red 🔴
    ↓
Clicks profile icon
    ↓
Goes to /admin
    ↓
Sees admin dashboard:
    - Dashboard overview
    - Manage products
    - View orders
    - Admin navigation
```

### Flow 4: Admin Tries /dashboard
```
Admin manually types /dashboard
    ↓
Page loads
    ↓
Checks user role
    ↓
Detects role='admin'
    ↓
Auto-redirects to /admin
    ↓
Shows admin dashboard
```

---

## 🎨 Visual Indicators

### Avatar Colors

**Green Avatar 🟢**
- User Type: Regular user
- Role: 'user'
- Access: User dashboard only
- Cannot access: `/admin` routes

**Red Avatar 🔴**
- User Type: Admin
- Role: 'admin'
- Access: Admin dashboard + all user features
- Can access: Everything

---

## 📊 Access Matrix

| Route | Not Logged In | Regular User 🟢 | Admin 🔴 |
|-------|--------------|----------------|----------|
| `/` | ✅ Access | ✅ Access | ✅ Access |
| `/products` | ✅ Access | ✅ Access | ✅ Access |
| `/cart` | ✅ Access | ✅ Access | ✅ Access |
| `/login` | ✅ Access | ✅ Access | ✅ Access |
| `/signup` | ✅ Access | ✅ Access | ✅ Access |
| `/dashboard` | ❌ → `/login` | ✅ Access | ❌ → `/admin` |
| `/admin` | ❌ → `/` | ❌ → `/` | ✅ Access |
| `/admin/products` | ❌ → `/` | ❌ → `/` | ✅ Access |
| `/admin/orders` | ❌ → `/` | ❌ → `/` | ✅ Access |

---

## 🔍 How to Identify User Type

### In Navbar:
1. **No avatar** (gray icon) = Not logged in
2. **Green avatar** 🟢 = Regular user
3. **Red avatar** 🔴 = Admin

### In Browser:
1. Click profile icon
2. Check URL:
   - `/login` = Not logged in
   - `/dashboard` = Regular user
   - `/admin` = Admin

### In Supabase:
1. Go to Table Editor
2. Open `profiles` table
3. Check `role` column:
   - `'user'` = Regular user 🟢
   - `'admin'` = Admin 🔴

---

## 🛠️ Developer Notes

### Navbar Logic
```typescript
// Check admin status
const { isAdmin: adminStatus } = await checkAdminAccess();
setIsAdmin(adminStatus);

// Set profile link
const profileLink = user 
  ? (isAdmin ? "/admin" : "/dashboard") 
  : "/login";

// Set avatar color
const avatarColor = isAdmin 
  ? "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" // Red
  : "linear-gradient(135deg, #16a34a 0%, #059669 100%)"; // Green
```

### Dashboard Logic
```typescript
// Check if admin
const { isAdmin } = await checkAdminAccess();

if (isAdmin) {
  // Redirect to admin dashboard
  router.push("/admin");
  return;
}

// Show user dashboard
```

---

## 🎯 Key Points

1. **Profile icon color indicates user type**
   - Green = Regular user
   - Red = Admin

2. **Profile icon links to appropriate dashboard**
   - Regular user → `/dashboard`
   - Admin → `/admin`

3. **Admins cannot access `/dashboard`**
   - Auto-redirects to `/admin`

4. **Regular users cannot access `/admin`**
   - Auto-redirects to `/` (homepage)

5. **Role change requires re-login**
   - Change role in Supabase
   - User logs out and back in
   - New role takes effect

---

## 🆘 Troubleshooting

### Issue: Profile icon not changing color
**Check**:
1. User is logged in
2. Role is set correctly in Supabase
3. Browser cache is cleared
4. Page is refreshed

### Issue: Wrong dashboard showing
**Check**:
1. User role in Supabase `profiles` table
2. User has logged out and back in after role change
3. No browser cache issues
4. Check browser console for errors

### Issue: Redirect not working
**Check**:
1. `checkAdminAccess()` function is working
2. No JavaScript errors in console
3. User session is valid
4. Database connection is working

---

## 📝 Quick Commands

### Check User Role
```sql
SELECT email, role 
FROM public.profiles 
WHERE email = 'user@example.com';
```

### Change to Admin
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

### Change to Regular User
```sql
UPDATE public.profiles 
SET role = 'user' 
WHERE email = 'admin@example.com';
```

---

**Last Updated**: Current Session  
**Status**: ✅ Complete and Working  
**Visual Indicators**: ✅ Implemented (Red/Green Avatars)
