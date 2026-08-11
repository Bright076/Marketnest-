# ⚡ Vendo Setup - TODO List

## 🎯 What You Need to Do Next

### ✅ Code Implementation: DONE
All code has been written and is ready to deploy.

---

## 📝 Your Action Items

### 1. Run Database Migration (5 minutes)
**File:** `VENDO_PAYMENT_MIGRATION.sql`

1. Open Supabase Dashboard: https://supabase.com/dashboard/project/yuhevckzxzzkazxickir
2. Go to: SQL Editor
3. Copy the entire contents of `VENDO_PAYMENT_MIGRATION.sql`
4. Paste and click "Run"
5. Verify success message

**Quick verification:**
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name = 'merchant_order_id';
```
Should return 1 row if successful.

---

### 2. Get Vendo Partner API Key
**Contact:** Vendo support team at vendo.com.ng

**What to ask for:**
1. Partner API Key (looks like: `vd_partner_live_xxxxxxxxxxxxx`)
2. Confirm API endpoint: `https://vendo.com.ng/api/partner/payments/create`
3. Webhook authentication method (signature/secret/HMAC?)
4. Sandbox/test environment credentials (if available)

**Questions to ask Vendo:**
- What's the webhook retry policy?
- How do you authenticate webhook requests?
- Can you provide test webhook payload examples?
- Do you support USD directly or only NGN?
- What's the current USD to NGN exchange rate you use?

---

### 3. Update Environment Variables

#### Local (.env.local)
Replace `YOUR_VENDO_API_KEY_HERE` with your actual key:
```env
VENDO_PARTNER_API_KEY=vd_partner_live_xxxxxxxxxxxxx
```

#### Vercel (vercel.com/dashboard)
1. Go to your project settings
2. Environment Variables
3. Add/update:
   - `VENDO_PARTNER_API_KEY` = (your actual key)
   - `VENDO_BASE_URL` = `https://vendo.com.ng`
   - `NEXT_PUBLIC_SITE_URL` = `https://marketnest-shop-one.vercel.app`
4. Select: Production + Preview + Development
5. Save

---

### 4. Configure Webhook with Vendo
Provide this URL to Vendo:
```
https://marketnest-shop-one.vercel.app/api/payment/webhook
```

Tell them: "Please send payment confirmation webhooks to this endpoint"

---

### 5. Deploy
```bash
cd marketnest
git add .
git commit -m "Add Vendo payment integration"
git push
```

Vercel will auto-deploy.

---

### 6. Test Payment Flow
1. Go to: https://marketnest-shop-one.vercel.app
2. Add a product to cart
3. Go to checkout
4. Fill delivery form
5. Click "Proceed to Payment"
6. Complete payment on Vendo page
7. Verify success page shows up
8. Check Supabase - order should be marked 'paid'
9. Check Telegram - notification should arrive

---

## 🔔 After First Successful Test

### Update Webhook Verification
Once Vendo tells you how to verify webhooks:

**File to update:** `app/api/payment/webhook/route.ts`

**Look for this comment:**
```typescript
// TODO: Implement webhook signature verification when Vendo provides the mechanism
```

**Add verification like:**
```typescript
const signature = request.headers.get('x-vendo-signature');
const isValid = verifySignature(body, signature, VENDO_WEBHOOK_SECRET);
if (!isValid) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
}
```

Then redeploy.

---

## 📚 Documentation Files

If you forget anything, check these files:

| File | Purpose |
|------|---------|
| `VENDO_QUICK_START.md` | 5-step setup guide |
| `VENDO_IMPLEMENTATION_GUIDE.md` | Complete technical docs |
| `VENDO_INTEGRATION_SUMMARY.md` | Overview of changes |
| `DEPLOYMENT_READY.md` | Pre-deployment checklist |
| `TODO_VENDO_SETUP.md` | This file |

---

## ⚠️ Important Reminders

- **Never commit your Vendo API key to Git**
- **USD → NGN conversion rate is hardcoded at 1:1500** (update if needed)
- **Webhook verification is NOT implemented yet** (waiting for Vendo's method)
- **Test in sandbox first** (if Vendo provides one)
- **Site currency is USD, payment currency is NGN**

---

## ✅ Checklist

- [ ] Run database migration in Supabase
- [ ] Get Vendo Partner API key
- [ ] Update `.env.local` with real API key
- [ ] Add environment variables to Vercel
- [ ] Provide webhook URL to Vendo
- [ ] Ask Vendo about webhook authentication
- [ ] Deploy to Vercel
- [ ] Test payment flow
- [ ] Verify order marked as paid
- [ ] Verify Telegram notification
- [ ] Implement webhook verification (after Vendo confirms method)

---

## 🆘 If Something Goes Wrong

1. **Check Vercel Logs:** vercel.com/dashboard → Your Project → Logs
2. **Check Supabase:** Look at orders table
3. **Check Browser Console:** Press F12 and look for errors
4. **Read the guides:** Full troubleshooting in `VENDO_IMPLEMENTATION_GUIDE.md`

---

## 🎉 That's It!

Once you complete the checklist above, your payment system will be live and accepting real payments via Vendo/Flutterwave.

**Good luck! 🚀💰**
