# ⚠️ CJ API Key Required - Email Won't Work

## The Real Issue
CJDropshipping API does **NOT** accept email for authentication. It requires an **API Key** that you must generate from your CJ dashboard.

## What You Need to Do Right Now

### 1️⃣ Get Your API Key from CJ Dashboard

Go to: **https://cjdropshipping.com/personal_center.html#/apiList**

Steps:
1. Click **Add API** button
2. Enter any name (e.g., "MarketNest")
3. Select Type: **API Key**
4. Click Confirm
5. **Copy the generated API Key** (format: `CJ{userId}@api@{token}`)

### 2️⃣ Your API Key Will Look Like This:
```
CJ5366105@api@465930408b5e4ce6a5802e538fbf01a7
```

The example above is just a sample. You need to get YOUR actual API Key from the CJ dashboard.

### 3️⃣ Update Your Local .env.local

Open `marketnest/.env.local` and replace:
```env
CJ_API_KEY=CJ5366105@api@465930408b5e4ce6a5802e538fbf01a7
```

With YOUR actual API Key.

### 4️⃣ Restart Your Dev Server
```bash
npm run dev
```

### 5️⃣ Test Locally
Go to: http://localhost:3000/admin/cj-test

Click "Test CJ API Connection" - should see ✅

### 6️⃣ Update Vercel
1. Go to https://vercel.com → Your Project → Settings → Environment Variables
2. Find `CJ_API_KEY`
3. Update to your full API Key (format: `CJ{userId}@api@{token}`)
4. Save and redeploy

## Why Email Didn't Work

The error message `"That's not a valid email address"` was actually misleading. The CJ API was rejecting the request because:
- ✅ It expects parameter: `apiKey`
- ❌ We were sending: `email`

The official CJ API documentation confirms authentication requires an API Key, not email credentials.

## Full Documentation

Read `HOW_TO_GET_CJ_API_KEY.md` for detailed step-by-step instructions with screenshots description.

## Summary
1. ❌ Email authentication: **Does NOT work**
2. ❌ Email:password format: **Does NOT work**
3. ✅ API Key from CJ dashboard: **This is the correct way**

Get your API Key now at: https://cjdropshipping.com/personal_center.html#/apiList
