# Vendo API Verification Steps

## ✅ Current Status

### Local Environment (.env.local)
- ✅ `VENDO_PARTNER_API_KEY` = `vd_partner_live_5d9b7f4a8c2e91f3b6d8a7e5c1f9b2a4d7e8c6f1a9b3d5e7f2c8a1d4b6e9f3`
- ✅ `VENDO_BASE_URL` = `https://vendo.com.ng`
- ✅ API Key format: Starts with `vd_partner_live_` (correct format)
- ✅ API Key length: 75 characters

### Production Environment (Vercel)
Need to verify the **exact same** values are in Vercel Production environment.

## 🔍 HOW TO CHECK VERCEL FUNCTION LOGS

### Method 1: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project: **marketnest**
3. Click **Logs** (or **Functions** → **Logs**)
4. Look for recent `/api/payment/create` function calls
5. Find the logs with emojis: 🔍 📦 📤 📥

### Method 2: Vercel CLI
```bash
vercel logs marketnest-shop-one.vercel.app --follow
```

Then try checkout again to see live logs.

## 📋 INFORMATION TO EXTRACT FROM LOGS

Look for these exact log lines:

```
📤 Vendo URL: [should be https://vendo.com.ng/api/partner/payments/create]
📤 Has API Key: [should be true]
📤 API Key length: [should be 75]
📤 API Key first 8 chars: [should be vd_partn...]
```

And most importantly:
```
📥 Vendo response status: 403
📥 Vendo full response body: [COPY THIS ENTIRE MESSAGE]
```

## 🚨 COMMON CAUSES OF 403 ERROR

1. **Wrong API Key in Vercel**
   - Verify the key in Vercel matches the one in `.env.local` exactly
   - No extra spaces or line breaks
   - Correct environment: Production & Preview

2. **API Key Not Active**
   - Contact Vendo to verify the key is active
   - Ask if the key has been enabled for production use

3. **IP Whitelist**
   - Vercel functions use dynamic IPs
   - Ask Vendo if they have IP whitelist enabled
   - If yes, they need to whitelist Vercel's IP ranges

4. **Missing Permissions**
   - The API key might not have permission for `/api/partner/payments/create`
   - Ask Vendo what permissions this key has

5. **Wrong Endpoint**
   - Verify we're calling the correct endpoint
   - Current: `POST https://vendo.com.ng/api/partner/payments/create`

## 📧 MESSAGE TO SEND TO VENDO SUPPORT

```
Subject: 403 Forbidden Error on Partner Payments API

Hi Vendo Team,

I'm integrating with your Partner Payments API and receiving a 403 Forbidden error.

API Key: vd_partner_live_5d9b7f4a8c2e...
Endpoint: POST https://vendo.com.ng/api/partner/payments/create
Environment: Vercel Serverless (Production)

Request Headers:
- Authorization: Bearer [API_KEY]
- Content-Type: application/json

Error Response:
[PASTE THE FULL RESPONSE FROM VERCEL LOGS HERE]

Questions:
1. Is this API key active and authorized for production?
2. Does it have permission to create payments?
3. Do you have IP whitelist restrictions? (Vercel uses dynamic IPs)
4. Is the request payload structure correct?

Please advise on how to resolve this 403 error.

Thank you!
```

## ⏭️ NEXT STEPS

1. ✅ Access Vercel Function Logs
2. ✅ Copy the full Vendo response body
3. ✅ Fill in `VENDO_403_ERROR_REPORT.md` with actual values
4. ✅ Send to Vendo support
5. ⏳ Wait for Vendo's response
6. ⏳ Implement their recommended fix

---

**Note**: Until Vendo resolves the 403 error, you can still use the USDT payment method which is working perfectly!
