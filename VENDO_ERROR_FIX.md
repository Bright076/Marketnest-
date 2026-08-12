# Fixing Vendo Payment 500 Error

## Problem
Getting error: `Failed to load resource: the server responded with a status of 500`
Error message: `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

This means the payment API route `/api/payment/create` is returning an error page (HTML) instead of JSON.

## Root Cause
The `VENDO_PARTNER_API_KEY` environment variable is **NOT set in Vercel**.

The API checks for this variable and returns a 500 error if it's missing:
```typescript
if (!VENDO_PARTNER_API_KEY) {
  console.error('❌ VENDO_PARTNER_API_KEY not configured');
  return NextResponse.json(
    { success: false, error: 'Payment system not configured' },
    { status: 500 }
  );
}
```

## Solution: Add Environment Variables to Vercel

### Required Variables:
```
VENDO_PARTNER_API_KEY=vd_partner_live_5d9b7f4a8c2e91f3b6d8a7e5c1f9b2a4d7e8c6f1a9b3d5e7f2c8a1d4b6e9f3
VENDO_BASE_URL=https://vendo.com.ng
NEXT_PUBLIC_SITE_URL=https://marketnest-shop-one.vercel.app
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1aGV2Y2t6eHp6a2F6eGlja2lyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODM1ODkxNCwiZXhwIjoyMDkzOTM0OTE0fQ.tB1SHpIiUfg2a-R9pxMzXUYw38xOnhsKo6PgmMGOv9I
```

### Steps to Add in Vercel:

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your "marketnest" project

2. **Open Settings**
   - Click "Settings" tab at the top

3. **Environment Variables**
   - Click "Environment Variables" in the left sidebar

4. **Add Each Variable**
   - Click "Add New" button
   - Enter the **Key** (variable name)
   - Enter the **Value** (from above)
   - Select environments:
     - ✅ **Production**
     - ✅ **Preview**
     - ❌ Development (leave unchecked - uses `.env.local`)
   - Click "Save"

5. **Repeat for All 4 Variables**

6. **Redeploy**
   - After adding all variables, go to "Deployments" tab
   - Click the "..." menu on the latest deployment
   - Click "Redeploy"
   - OR just push a new commit to trigger auto-deploy

### Variables You Need to Add:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `VENDO_PARTNER_API_KEY` | `vd_partner_live_5d9b7f4a8c2e91f3b6d8a7e5c1f9b2a4d7e8c6f1a9b3d5e7f2c8a1d4b6e9f3` | Vendo API key for payment processing |
| `VENDO_BASE_URL` | `https://vendo.com.ng` | Vendo API base URL |
| `NEXT_PUBLIC_SITE_URL` | `https://marketnest-shop-one.vercel.app` | Your site URL for redirects |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` (from .env.local) | Supabase admin key for bypassing RLS |

**Note:** `NEXT_PUBLIC_*` variables are exposed to the browser, others are server-only.

## How to Verify It's Fixed:

### 1. Check Vercel Logs
- Go to your Vercel project
- Click "Logs" or "Functions" tab
- Try making a payment
- Look for error messages in the logs

### 2. Test Payment
- Add product to cart
- Go to checkout
- Fill in delivery info
- Select "Card Payment (Flutterwave)"
- Click "Proceed to Payment"
- Should redirect to Vendo payment page (not error)

### 3. Check Browser Console
After adding variables and redeploying, try payment again:
- Open browser DevTools (F12)
- Go to Console tab
- Try payment
- You should see:
  ```
  💳 Creating payment with Vendo...
  ✅ Payment created: [reference]
  ```
- NOT the 500 error

## Already Set in Vercel:

These variables should already be in Vercel (from previous setup):
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `TELEGRAM_BOT_TOKEN`
- ✅ `TELEGRAM_CHAT_ID`
- ✅ `CJ_API_KEY`

## Still Need to Add:

From previous USDT setup:
- ⚠️ `NEXT_PUBLIC_USDT_TRC20_ADDRESS=TP7h5qLNhXpfJ1PAS3swcobSQQc17E23fr`

## Summary

**Missing variables causing the 500 error:**
1. `VENDO_PARTNER_API_KEY` ← **CRITICAL**
2. `VENDO_BASE_URL` ← **CRITICAL**
3. `SUPABASE_SERVICE_ROLE_KEY` ← **CRITICAL**
4. `NEXT_PUBLIC_USDT_TRC20_ADDRESS` ← For USDT payments

**Action:** Add all 4 variables to Vercel → Redeploy → Test payment

Once added, the payment API will work and you'll be redirected to Vendo's payment page instead of getting a 500 error! 🚀
