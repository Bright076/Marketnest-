# 🚀 MarketNest Quick Start Guide

## ⚡ 3 Minutes to Your First Product

### Step 1: Run Database Migration (30 seconds)
1. Open **Supabase Dashboard** → SQL Editor
2. Copy and run this:
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
```
3. Click **Run** ✅

### Step 2: Start Your Server (30 seconds)
```bash
cd marketnest
npm run dev
```
Wait for: `✓ Ready on http://localhost:3000`

### Step 3: Add Your First Product (2 minutes)
1. Open browser: `http://localhost:3000`
2. Click **profile icon** → Login as admin
3. Click **"CJ Products"** in sidebar
4. Type **"iPhone"** → Click **Search**
5. Click **"Add to My Store"** on any product
6. Set profit to **$10**
7. Click **"Import to Store"** ✅

**Done!** Your first product is live. 🎉

---

## 📋 Checklist

### Before You Start:
- [ ] Supabase is configured
- [ ] `.env.local` has `CJ_API_KEY`
- [ ] Admin account created
- [ ] Database migration run ✅

### After First Product:
- [ ] Visit `/products` → See your product
- [ ] Add to cart → Test checkout
- [ ] Check payment shows **USD**
- [ ] Logo displays in navbar ✅

---

## 💳 Payment Info

| Customer Location | Payment | Currency |
|------------------|---------|----------|
| 🇳🇬 Nigeria | Card | USD |
| 🌍 Other Countries | Crypto | USD |

**All transactions in US Dollars (USD)**

---

## 📊 Pricing Formula

```
CJ Supplier Price:  $50
+ Your Profit:      $10
────────────────────────
= Customer Pays:    $60 USD
```

---

## 🎯 What's Working Now

✅ Logo displays  
✅ CJ product import  
✅ USD-only pricing  
✅ Card payment (Nigeria)  
✅ Crypto payment (International)  
✅ Shopping cart  
✅ Checkout system  
✅ Order management  

---

## 📖 Full Guides

Need more details? See:
- `HOW_TO_ADD_PRODUCTS_FROM_CJ.md` - Product import
- `FINAL_UPDATE_SUMMARY.md` - Recent updates
- `CJ_TRANSFORMATION_COMPLETE.md` - Complete docs

---

## 🚨 Common Issues

**Logo not showing?**
→ Clear cache (Ctrl+Shift+R)

**Can't import products?**
→ Check `/admin/cj-test` for API connection

**Checkout shows NGN?**
→ Hard refresh (Ctrl+Shift+R)

---

**Questions?** Check the full docs or console logs (F12) for errors.

Happy selling! 🎉
