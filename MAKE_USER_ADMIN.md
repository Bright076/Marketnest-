# 🔑 Quick Guide: Make a User Admin

## 🎯 Simple 3-Step Process

### Step 1: Sign Up a User
1. Go to `/signup` on your MarketNest site
2. Create an account with email and password
3. User will have `role = "user"` by default

### Step 2: Change Role in Supabase
1. Open **Supabase Dashboard**: https://supabase.com/dashboard
2. Go to **Table Editor** → Select `profiles` table
3. Find the user by email
4. Click on the `role` cell
5. Change from `"user"` to `"admin"`
6. Press **Enter** to save

### Step 3: User Re-login
1. User logs out
2. User logs back in
3. ✅ Admin access is now active!

---

## 🚀 Quick SQL Method

If you prefer SQL, run this in **Supabase SQL Editor**:

```sql
-- Replace with actual email
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

Verify it worked:
```sql
SELECT email, role 
FROM public.profiles 
WHERE email = 'user@example.com';
```

---

## ✅ What Admins Can Access

After becoming admin, the user can access:

- ✅ `/admin` - Admin dashboard
- ✅ `/admin/products` - Manage products
- ✅ `/admin/products/add` - Add new products
- ✅ `/admin/orders` - View all orders
- ✅ `/dashboard` - Regular user dashboard (still works)

Regular users (role='user') can only access:
- ✅ `/dashboard` - User dashboard
- ❌ `/admin/*` - Redirects to homepage

---

## 🔍 Check Current Admins

```sql
SELECT email, full_name, role, created_at
FROM public.profiles
WHERE role = 'admin'
ORDER BY created_at DESC;
```

---

## 🔄 Revoke Admin Access

```sql
UPDATE public.profiles 
SET role = 'user' 
WHERE email = 'admin@example.com';
```

---

## 📌 Important Notes

1. **User must re-login** after role change
2. **Only 2 valid roles**: `'admin'` or `'user'`
3. **Default role**: All new signups get `'user'`
4. **No code changes needed**: Just update database

---

## 🎬 Video Tutorial Steps

1. **Create Account** → Sign up at `/signup`
2. **Open Supabase** → Go to Table Editor
3. **Find User** → Search in `profiles` table
4. **Edit Role** → Change to `'admin'`
5. **Re-login** → Log out and back in
6. **Access Admin** → Visit `/admin`

---

**That's it!** 🎉

Your admin system is ready to use. Just change the role in Supabase and the user becomes an admin.
