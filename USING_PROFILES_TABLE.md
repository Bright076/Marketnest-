# Using Profiles Table in Your Code (Optional)

## Current Setup vs Profiles Table

### Current (user_metadata):
```typescript
// Dashboard reads from user_metadata
const fullName = user?.user_metadata?.full_name || "User";
const phone = user?.user_metadata?.phone || "N/A";
```

### With Profiles Table:
```typescript
// Dashboard reads from profiles table
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

const fullName = profile?.full_name || "User";
const phone = profile?.phone || "N/A";
```

---

## Benefits of Using Profiles Table

✅ **Better Performance** - Indexed queries
✅ **Easier Queries** - Standard SQL instead of JSON
✅ **Relationships** - Link to orders, reviews, etc.
✅ **Scalability** - Better for large user bases
✅ **Flexibility** - Add custom fields easily

---

## Example: Update Dashboard to Use Profiles

### File: `marketnest/app/dashboard/page.tsx`

**Current Code:**
```typescript
const fullName = user?.user_metadata?.full_name || "User";
const phone = user?.user_metadata?.phone || "N/A";
const email = user?.email || "N/A";
```

**Updated Code:**
```typescript
// Fetch profile from profiles table
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

const fullName = profile?.full_name || "User";
const phone = profile?.phone || "N/A";
const email = profile?.email || user?.email || "N/A";
```

---

## Example: Create Profile Edit Page

### File: `marketnest/app/profile/edit/page.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      // Load profile from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");

      // Update profile in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
        })
        .eq('id', user.id);

      if (error) throw error;

      setSuccess("Profile updated successfully!");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Edit Profile</h1>
      
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}

      <form onSubmit={handleSave}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
```

---

## Example: Query All Users (Admin)

```typescript
// Get all profiles (requires admin privileges or custom RLS policy)
const { data: profiles, error } = await supabase
  .from('profiles')
  .select('*')
  .order('created_at', { ascending: false });

console.log("Total users:", profiles?.length);
```

---

## Example: Search Users

```typescript
// Search users by name
const { data: profiles } = await supabase
  .from('profiles')
  .select('*')
  .ilike('full_name', '%john%');

// Search users by phone
const { data: profiles } = await supabase
  .from('profiles')
  .select('*')
  .ilike('phone', '%234%');
```

---

## Example: Add Custom Fields

### Step 1: Add Column in Supabase

```sql
ALTER TABLE public.profiles
ADD COLUMN avatar_url TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN location TEXT;
```

### Step 2: Update in Code

```typescript
const { error } = await supabase
  .from('profiles')
  .update({
    avatar_url: 'https://example.com/avatar.jpg',
    bio: 'Software developer',
    location: 'Lagos, Nigeria',
  })
  .eq('id', user.id);
```

---

## Example: Link Profiles to Orders

### Create Orders Table:

```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Query User's Orders:

```typescript
const { data: orders } = await supabase
  .from('orders')
  .select(`
    *,
    profiles (
      full_name,
      email,
      phone
    )
  `)
  .eq('user_id', user.id);
```

---

## Migration Guide

### Option 1: Keep Using user_metadata (Current)
✅ No code changes needed
✅ Trigger still creates profiles in background
✅ Can migrate to profiles table later

### Option 2: Switch to Profiles Table
✅ Better performance
✅ More flexible
✅ Requires updating dashboard code

---

## Do You Need to Update Your Code?

**No!** The trigger works automatically. Your current code using `user_metadata` will continue to work fine.

**But if you want better performance and flexibility**, you can update your code to use the profiles table as shown in the examples above.

---

## Summary

✅ **Trigger is automatic** - No code changes required
✅ **Current code still works** - user_metadata approach is fine
✅ **Optional upgrade** - Use profiles table for better performance
✅ **Easy to extend** - Add custom fields anytime

**The choice is yours!** Both approaches work perfectly. 🎉
