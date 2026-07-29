# 🔑 CJDropShipping API Setup Instructions

## What You Need

Your **CJDropShipping account email** (the one you used to register)

---

## Step 1: Update Local Environment Variable

Open `.env.local` and update the `CJ_API_KEY` line:

### If you only have email (no password):
```env
CJ_API_KEY=your-cj-email@example.com
```

### If you have email and password:
```env
CJ_API_KEY=your-cj-email@example.com:your-password
```

**Example:**
```env
CJ_API_KEY=john@example.com
```

---

## Step 2: Update Vercel Environment Variable

1. Go to **Vercel Dashboard**
2. Select your **Marketnest project**
3. Go to **Settings** → **Environment Variables**
4. Find `CJ_API_KEY`
5. Click **Edit**
6. Update the value to your email (same format as above)
7. Click **Save**

---

## Step 3: Test the Connection

1. After updating, go to your site
2. Login as admin
3. Go to `/admin/cj-test`
4. Click "Test CJ API Connection"
5. Should show: ✅ Connected Successfully

---

## Step 4: Import Products

Once connection is working:
1. Go to `/admin/cj-products`
2. Search for products (e.g., "iPhone")
3. Click "Add to My Store"
4. Set profit and import

---

## 🚨 Troubleshooting

### Still getting 401 errors?

You might need to:
1. **Get an API Key from CJDropShipping**:
   - Log into https://cjdropshipping.com
   - Go to **Settings** → **API**
   - Generate or copy your API key
   - Use that key instead of your email

2. **Check if you have a password**:
   - If you set a password during registration
   - Use format: `email:password`

3. **Contact CJ Support**:
   - Ask them for the correct API authentication method
   - They should provide either:
     - API Key
     - Email + Password
     - OAuth credentials

---

## 📧 Your Current Email

Please tell me your CJDropShipping registration email so I can help you format it correctly!

---

**After you provide your email, I'll update the `.env.local` file for you.**
