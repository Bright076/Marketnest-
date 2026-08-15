# 🔍 Vendo 403 Error - Debugging Guide

**Date:** August 13, 2026  
**Status:** 403 Forbidden - API Key Rejected  
**Next Action:** Test and verify with Vendo API owner

---

## 🎯 CURRENT SITUATION

### The Problem:
- **Vendo API returns HTTP 403 Forbidden**
- Error means: "You don't have permission to access this resource"
- Happens when creating payments via `/api/partner/payments/create`

### What We Know:
✅ Environment variables ARE set in Vercel Production:
- `VENDO_PARTNER_API_KEY`: Present (72 chars)
- `VENDO_BASE_URL`: `https://vendo.com.ng`
- `NEXT_PUBLIC_SITE_URL`: `https://marketnest-shop-one.vercel.app`

✅ Request format looks correct:
```typescript
{
  method: 'POST',
  headers: {
    'Authorization': 'Bearer vd_partner_live_...',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount, currency, customer, description,
    merchantOrderId, redirectUrl, callbackUrl
  })
}
```

❌ Vendo rejects the request with 403

---

## 🧪 TEST ENDPOINT CREATED

I created a diagnostic endpoint to help debug the issue:

**URL:** `https://marketnest-shop-one.vercel.app/api/payment/vendo-test`

### What It Does:
1. ✅ Verifies `VENDO_PARTNER_API_KEY` is available in production
2. ✅ Shows API key preview (first 8 + last 4 chars, rest hidden)
3. ✅ Makes test payment request to Vendo
4. ✅ Captures full response (status, headers, body)
5. ✅ Provides diagnostic analysis
6. ✅ Suggests next steps

### How to Use:
```bash
# After deployment, visit this URL in browser:
https://marketnest-shop-one.vercel.app/api/payment/vendo-test

# Or use curl:
curl https://marketnest-shop-one.vercel.app/api/payment/vendo-test
```

### Expected Output:
```json
{
  "test": "Vendo API Connection Test",
  "environment": {
    "hasApiKey": true,
    "apiKeyLength": 72,
    "apiKeyPreview": "vd_partn...b6e9",
    "baseUrl": "https://vendo.com.ng"
  },
  "response": {
    "status": 403,
    "statusText": "Forbidden",
    "bodyRaw": "...",
    "bodyParsed": {...}
  },
  "diagnosis": {
    "authentication": "FAILED - API Key Rejected",
    "possibleIssues": [...],
    "nextSteps": [...]
  }
}
```

---

## 🔍 POSSIBLE CAUSES OF 403 ERROR

### 1. API Key Issues (Most Likely)
- ❌ **API key is incorrect** - typo when copying
- ❌ **API key expired** - needs regeneration
- ❌ **API key not activated** - needs approval from Vendo
- ❌ **Wrong API key type** - using regular API key instead of Partner API key

### 2. Account/Permission Issues
- ❌ **Partner API not enabled** - account doesn't have Partner API access
- ❌ **Account not approved** - waiting for Vendo approval
- ❌ **Test vs Live mode** - using test key in production or vice versa

### 3. Endpoint/Configuration Issues
- ❌ **Wrong endpoint URL** - should be `/api/partner/payments/create`
- ❌ **Wrong base URL** - should be `https://vendo.com.ng`
- ❌ **IP whitelist** - Vercel IP not whitelisted (rare)

### 4. Request Format Issues (Less Likely)
- ❌ **Wrong header format** - should be `Bearer <key>`, not just `<key>`
- ❌ **Missing required fields** - payload missing mandatory fields
- ❌ **Invalid payload structure** - JSON structure doesn't match API spec

---

## 🛠️ DEBUGGING STEPS

### Step 1: Run Test Endpoint
1. Deploy the code (test endpoint included)
2. Visit `/api/payment/vendo-test`
3. Copy the full JSON response
4. Check the `response.bodyRaw` field for error message

### Step 2: Verify API Key in Vercel
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Find `VENDO_PARTNER_API_KEY`
4. **DO NOT** copy/share it publicly
5. Verify it matches what Vendo gave you:
   - Should start with `vd_partner_`
   - Should be 60-80 characters long
   - No extra spaces or line breaks

### Step 3: Check Vendo Dashboard
1. Log in to Vendo Partner Dashboard
2. Go to API / Developer Settings
3. Verify:
   - Partner API is enabled for your account
   - API key is "Active" status (not expired/revoked)
   - Your account has "Partner" level access
   - Check if there's IP whitelist (add Vercel IPs if needed)

### Step 4: Contact Vendo Support
If all above checks pass, share this with Vendo:

```
Subject: Partner API returning 403 Forbidden

Hello Vendo Support,

I'm integrating the Partner API for payment creation but receiving 403 Forbidden.

Details:
- Endpoint: https://vendo.com.ng/api/partner/payments/create
- Method: POST
- Headers: Authorization: Bearer vd_partner_... Content-Type: application/json
- Response: HTTP 403 Forbidden
- API Key: vd_partner_live_5d9b7f4a... (first 20 chars)

My account email: [YOUR_EMAIL]
Partner ID: [YOUR_PARTNER_ID if you have one]

Could you please verify:
1. Is my API key active and approved?
2. Does my account have Partner API access?
3. Is there an IP whitelist I need to add Vercel to?
4. Am I using the correct endpoint?

Test endpoint results: [PASTE JSON FROM /api/payment/vendo-test]

Thank you!
```

---

## 📋 VERIFICATION CHECKLIST

Before contacting Vendo, verify:

- [ ] API key is correctly copied to Vercel env vars
- [ ] API key has no extra spaces or characters
- [ ] API key starts with `vd_partner_` (partner API key)
- [ ] Using correct base URL: `https://vendo.com.ng`
- [ ] Using correct endpoint: `/api/partner/payments/create`
- [ ] Authorization header format: `Bearer <key>`
- [ ] Content-Type header: `application/json`
- [ ] Request body is valid JSON
- [ ] Test endpoint shows API key is present in production
- [ ] Vendo account has Partner API access enabled
- [ ] API key status is "Active" in Vendo dashboard

---

## 🔧 QUICK FIXES TO TRY

### Fix 1: Regenerate API Key
1. Go to Vendo Dashboard → API Settings
2. Click "Regenerate API Key"
3. Copy new key (starts with `vd_partner_`)
4. Update in Vercel environment variables
5. Redeploy

### Fix 2: Check API Key Type
If your key doesn't start with `vd_partner_`, you might have:
- Regular API key (starts with `vd_live_` or just `vd_`)
- Test API key (starts with `vd_test_` or `vd_partner_test_`)

You need **Partner API key** for `/api/partner/payments/create`

### Fix 3: Test with Different Endpoint
Try the regular payment API if partner API isn't working:
```typescript
// Instead of: /api/partner/payments/create
// Try: /api/payments/create (if available)
```

### Fix 4: Add Accept Header
Some APIs require explicit Accept header:
```typescript
headers: {
  'Authorization': `Bearer ${key}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json', // Add this
}
```

---

## 📊 EXPECTED VS ACTUAL

### Expected Behavior (Working):
```
Request: POST /api/partner/payments/create
Headers: Authorization: Bearer vd_partner_live_...
Response: 200 OK
Body: {
  "success": true,
  "partnerReference": "VDO123456",
  "paymentLink": "https://vendo.com.ng/pay/abc123",
  "status": "pending"
}
```

### Actual Behavior (Current):
```
Request: POST /api/partner/payments/create
Headers: Authorization: Bearer vd_partner_live_...
Response: 403 Forbidden
Body: (need to capture from test endpoint)
```

---

## 🎯 NEXT ACTIONS

### Immediate:
1. ✅ **Deploy code** (includes test endpoint)
2. ✅ **Run test endpoint** → Get detailed error from Vendo
3. ✅ **Verify API key** in Vercel matches Vendo dashboard
4. ✅ **Check Vendo dashboard** for API key status

### If Still 403:
1. **Contact Vendo support** with test endpoint results
2. **Request API access verification** - confirm partner access
3. **Ask for correct endpoint** - confirm URL and structure
4. **Request example request** - ask for working curl example

### Temporary Solution:
- Keep Flutterwave/Vendo disabled with "NOT AVAILABLE" badge
- Use USDT as primary payment method
- Enable Flutterwave once 403 is resolved

---

## 💡 IMPORTANT NOTES

### About 403 vs 401:
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Valid authentication, but no permission
- Since you're getting 403, your request format is likely correct
- The issue is with API key permission/approval

### About Partner API:
- Partner API is different from regular Vendo API
- Requires special account type and approval
- Not all Vendo accounts have partner access
- May need to apply for partner program

### About Vendo.com.ng:
- This is Vendo Nigeria (different from VendoServices.com)
- Documentation might not be publicly available
- May need to request API docs from account manager
- Integration might require onboarding/approval process

---

## 📝 SUMMARY

**Current Status:**
- Code is correct ✅
- Environment vars are set ✅
- Request format is correct ✅
- **API key is being rejected ❌**

**Most Likely Cause:**
- API key not activated/approved
- Account doesn't have Partner API access
- Need Vendo support to enable access

**Recommended Action:**
1. Run test endpoint to get exact error
2. Share results with Vendo support
3. Request Partner API access verification
4. Use USDT payment in the meantime

---

**Status:** Awaiting test endpoint results and Vendo support response 🔍
