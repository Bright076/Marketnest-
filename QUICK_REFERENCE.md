# 🚀 CJDropShipping MarketNest - Quick Reference

## 🔧 Setup (First Time)

### 1. Database Migration
```sql
-- Run in Supabase SQL Editor

-- Add CJ product tracking (if not done)
ALTER TABLE products ADD COLUMN IF NOT EXISTS cj_pid TEXT;

-- Add payment fields to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
```

### 2. Environment Variables
```env
CJ_API_KEY=YOUR_CJ_API_KEY
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 3. Start Server
```bash
npm run dev
```

---

## 🎯 Admin Workflow

### Import Products:
1. `/admin/cj-products` → Search CJ products
2. Click "Add to My Store" on any product
3. Set profit amount (e.g., $10)
4. Click "Import to Store"

### Manage Products:
1. `/admin/products` → View imported CJ products
2. Click "Edit Profit" → Update profit margin
3. Click "Delete" → Remove product

### View Orders:
1. `/admin/orders` → See all orders
2. Check `currency` and `payment_method` columns
3. Verify payment and update order status

---

## 🛒 Customer Workflow

### Browse & Purchase:
1. `/products` → Browse CJ products
2. Click product → View details
3. "Add to Cart" → Add multiple products
4. `/cart` → Review items
5. "Proceed to Checkout"

### Checkout:
1. Fill customer information form
2. Select **Country**:
   - Nigeria → Auto-selects Bank Transfer (NGN)
   - USA/Other → Auto-selects Crypto (USDT)
3. Enter delivery address
4. Click "Place Order"
5. Redirected to success page

---

## 💰 Pricing Logic

```
Supplier Price (from CJ) = $50
+ Profit Amount (set by admin) = $10
─────────────────────────────────
= Selling Price (shown to customer) = $60
```

**Customer sees**: Only $60
**Admin sees**: Supplier price, profit, and selling price

---

## 💳 Payment Methods

| Customer Location | Payment | Currency | Rate |
|------------------|---------|----------|------|
| Nigeria 🇳🇬 | Bank Transfer | NGN | 1500 NGN per USD |
| International 🌍 | Crypto | USDT | 1:1 with USD |

---

## 📊 Database Schema

### Products Table:
- `id`, `title`, `description`, `image_url`
- `supplier_price` - From CJ API
- `profit_amount` - Set by admin
- `selling_price` - Supplier + Profit
- `stock`, `category`
- `product_type` - Always 'cj'
- `cj_pid` - CJ Product ID (unique)

### Orders Table:
- `id`, `user_id`, `product_id`
- `customer_name`, `customer_phone`, `customer_address`
- `amount_paid` - In selected currency
- `currency` - 'USD', 'NGN', or 'USDT'
- `payment_method` - 'bank_transfer' or 'crypto'
- `payment_status` - 'pending', 'paid', 'failed'
- `order_status` - 'pending', 'processing', 'shipped', 'delivered'

---

## 🔍 Common Issues

### Products not showing?
→ Import products from `/admin/cj-products` first

### Checkout redirects to login?
→ Login as customer first at `/login`

### Currency field missing in orders?
→ Run `ORDERS_TABLE_UPDATE.sql` in Supabase

### Cart empty after refresh?
→ Normal - cart uses browser localStorage

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `app/admin/cj-products/page.tsx` | Search & import CJ products |
| `app/admin/products/page.tsx` | Manage imported products |
| `app/products/page.tsx` | Store front (CJ only) |
| `app/cart/page.tsx` | Shopping cart |
| `app/checkout/page.tsx` | Complete checkout |
| `lib/cjService.ts` | CJ API functions |

---

## 🎨 Color Scheme

- **CJ Products**: Orange (#f97316)
- **Success/Green**: #16a34a
- **Nigeria**: Green (#16a34a)
- **International**: Blue (#3b82f6)

---

## 📞 Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production
npm start

# Check for errors
npm run lint
```

---

## ✅ Testing Checklist

**Admin:**
- [ ] Import CJ product
- [ ] Edit profit amount
- [ ] Delete product
- [ ] View orders

**Customer:**
- [ ] Browse products
- [ ] View product details
- [ ] Add to cart (multiple)
- [ ] Checkout (Nigeria)
- [ ] Checkout (International)
- [ ] Verify order in database

---

**For Full Documentation**: See `CJ_TRANSFORMATION_COMPLETE.md`
