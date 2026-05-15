# 🪣 Supabase Storage Bucket Setup

## Quick Setup Guide for Image Uploads

---

## 📋 Prerequisites

- Supabase project already created
- Admin access to Supabase Dashboard

---

## 🚀 Step-by-Step Setup

### Step 1: Create Storage Bucket

1. Open **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your **MarketNest project**
3. Click **Storage** in the left sidebar
4. Click **Create a new bucket** button

### Step 2: Configure Bucket

**Bucket Settings:**
- **Name**: `products`
- **Public bucket**: ✅ **Enable** (check the box)
- **File size limit**: 5MB (recommended)
- **Allowed MIME types**: Leave empty (allows all image types)

Click **Create bucket**

---

## 🔐 Step 3: Set Bucket Policies

### Option A: Using Supabase Dashboard (Recommended)

1. Go to **Storage** → Click on `products` bucket
2. Click **Policies** tab
3. Click **New Policy**

#### Policy 1: Allow Authenticated Upload
```
Policy Name: Authenticated users can upload images
Allowed operation: INSERT
Target roles: authenticated
USING expression: bucket_id = 'products'
WITH CHECK expression: bucket_id = 'products'
```

#### Policy 2: Allow Public Read
```
Policy Name: Public can view images
Allowed operation: SELECT
Target roles: public
USING expression: bucket_id = 'products'
```

#### Policy 3: Allow Authenticated Delete
```
Policy Name: Authenticated users can delete images
Allowed operation: DELETE
Target roles: authenticated
USING expression: bucket_id = 'products'
```

### Option B: Using SQL Editor

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this SQL:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

-- Allow public read access
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');
```

---

## ✅ Step 4: Verify Setup

### Test Upload (Optional)

1. Go to **Storage** → `products` bucket
2. Click **Upload file**
3. Select a test image
4. ✅ Should upload successfully

### Test Public Access

1. After uploading, click on the file
2. Copy the **Public URL**
3. Open URL in new browser tab
4. ✅ Image should be visible

---

## 🎯 Bucket Configuration Summary

| Setting | Value |
|---------|-------|
| **Bucket Name** | `products` |
| **Public Access** | ✅ Enabled |
| **File Size Limit** | 5MB |
| **Upload Permission** | Authenticated users |
| **Read Permission** | Public |
| **Delete Permission** | Authenticated users |

---

## 🔍 Verify Bucket Exists

Run this in **SQL Editor**:

```sql
SELECT * FROM storage.buckets WHERE name = 'products';
```

Should return:
```
id | name     | public
---|----------|--------
... | products | true
```

---

## 📊 Check Bucket Policies

Run this in **SQL Editor**:

```sql
SELECT * FROM storage.policies WHERE bucket_id = 'products';
```

Should show 3 policies (INSERT, SELECT, DELETE)

---

## 🐛 Troubleshooting

### Issue: Bucket Already Exists
**Solution**: Use the existing bucket, just verify it's public

### Issue: Upload Fails with "Permission Denied"
**Solution**: 
1. Check bucket is public
2. Verify INSERT policy exists
3. Ensure user is authenticated

### Issue: Images Not Loading
**Solution**:
1. Check bucket is public
2. Verify SELECT policy exists
3. Check URL is correct

### Issue: Can't Delete Images
**Solution**:
1. Verify DELETE policy exists
2. Ensure user is authenticated
3. Check user owns the file

---

## 🔄 Alternative: Use Existing Bucket

If you already have a bucket for images:

1. Update the bucket name in your code:

```typescript
<ImageUpload
  onUploadComplete={(url) => handleUpload(url)}
  bucketName="your-existing-bucket"
/>
```

2. Ensure the bucket is public
3. Verify policies allow authenticated upload

---

## 📝 Quick Checklist

Before using image upload feature:

- [ ] Bucket named `products` exists
- [ ] Bucket is set to **public**
- [ ] INSERT policy for authenticated users
- [ ] SELECT policy for public access
- [ ] DELETE policy for authenticated users
- [ ] Test upload works
- [ ] Test public URL is accessible

---

## 🎉 You're Done!

Your Supabase Storage is now configured for image uploads. The MarketNest admin can now:

- ✅ Upload product images directly
- ✅ Images stored in Supabase Storage
- ✅ Public URLs generated automatically
- ✅ Images accessible to all users

---

## 📚 Additional Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Storage Policies Guide](https://supabase.com/docs/guides/storage/security/access-control)
- [Storage API Reference](https://supabase.com/docs/reference/javascript/storage)

---

**Setup Time**: ~5 minutes  
**Difficulty**: Easy  
**Required**: Yes (for image uploads to work)
