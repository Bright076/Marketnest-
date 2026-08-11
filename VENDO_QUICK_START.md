# Vendo Payment Integration - Quick Start

## 🚀 Quick Setup (5 Steps)

### 1. Run Database Migration
Open Supabase SQL Editor and run:
```sql
-- Copy and paste contents from VENDO_PAYMENT_MIGRATION.sql
```

### 2. Get Your Vendo API Key
Contact Vendo to obtain your Partner API key.

### 3. Update Environment Variables

**Local (.env.local):**
```env
VENDO_PARTNER_API_KEY=your_actual_vendo_api_key
VENDO_BASE_URL=https://vendo.com.ng
NEXT_PUBLIC_SITE_URL=https://marketnest-shop-one.vercel.app
```

**Vercel:**
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add the same 3 variables above
4. Select: Production, Preview, Development
5. Save

### 4. Configure Webhook with Vendo
Tell Vendo to send payment callbacks to:
```
https://marketnest-shop-one.vercel.app/api/payment/webhook
```

### 5. Deploy to Vercel
```bash
cd marketnest
git add .
git commit -m "Add Vendo payment integration"
git push
```

---

## 🧪 Testing

1. Go to your site: https://marketnest-shop-one.vercel.app
2. Add products to cart
3. Click "Checkout"
4. Fill delivery information
5. Click "Proceed to Payment"
6. You should be redirected to Vendo/Flutterwave
7. Complete test payment
8. You should be redirected back to `/payment-complete`
9. Check Supabase - order should be marked as `paid`
10. Check Telegram - you should receive notification

---

## 📋 What Was Changed

### Database
- Added payment fields to `orders` table
- `merchant_order_id`, `partner_reference`, `flutterwave_transaction_id`, `paid_at`

### API Routes Created
- `POST /api/payment/create` - Creates payment with Vendo
- `POST /api/payment/webhook` - Receives payment confirmation

### Pages
- Updated `app/checkout/page.tsx` - Now redirects to Vendo
- Created `app/payment-complete/page.tsx` - Shows payment result

### Environment
- Added `VENDO_PARTNER_API_KEY`
- Added `VENDO_BASE_URL`
- Added `NEXT_PUBLIC_SITE_URL`

---

## 🔍 How It Works

1. **Checkout:** Orders created → Payment API called → Redirected to Vendo
2. **Payment:** Customer pays on Vendo/Flutterwave page
3. **Webhook:** Vendo sends confirmation → Order marked paid
4. **Complete:** Customer sees success page → Telegram notification sent

---

## ⚠️ Important

- **Currency:** USD on site → converted to NGN for Vendo (1 USD = 1500 NGN)
- **Webhook:** Payment confirmation is via webhook (not redirect)
- **Security:** Vendo API key is server-only (never exposed to browser)
- **Idempotency:** Duplicate webhooks handled safely

---

## 🆘 Troubleshooting

**Payment not marked as paid?**
- Check Vercel logs for webhook errors
- Verify webhook URL configured with Vendo
- Check order has `merchant_order_id`

**Can't create payment?**
- Verify `VENDO_PARTNER_API_KEY` is set in Vercel
- Check Vendo API endpoint is correct
- Look at browser console for errors

**Webhook not working?**
- Verify webhook URL with Vendo
- Check Vercel function logs
- Test webhook endpoint manually

---

## 📖 Full Documentation

See `VENDO_IMPLEMENTATION_GUIDE.md` for complete details, security notes, and troubleshooting.

---

**Status:** ✅ Integration Complete - Ready for Testing with Vendo API Key
