# 🚀 CJDropShipping Implementation Plan

## ✅ What Needs to Be Done

This document outlines the complete transformation of MarketNest to focus on CJDropShipping products.

---

## 📋 Implementation Checklist

### Phase 1: Database Setup ✅
- [x] Add `cj_pid` column to products table
- [x] Create unique index on `cj_pid`
- [ ] Run `CJ_PRODUCTS_MIGRATION.sql` in Supabase

### Phase 2: API Services ✅
- [x] Update `lib/cjService.ts` with product search
- [x] Create `/api/cj/products/search` endpoint
- [x] Create `/api/cj/products/import` endpoint
- [ ] Create `/api/cj/products/details` endpoint
- [ ] Create `/api/cj/products/refresh` endpoint

### Phase 3: Admin - CJ Products Page ⏳
- [ ] Create `/admin/cj-products` page
- [ ] Product search interface
- [ ] Product cards with "Add to Store" button
- [ ] Import modal with profit calculator
- [ ] Loading states and error handling

### Phase 4: Admin - Imported Products ⏳
- [ ] Create `/admin/imported-products` page
- [ ] List all CJ products in store
- [ ] Edit profit amount
- [ ] Auto-recalculate selling price
- [ ] Refresh stock from CJ
- [ ] Refresh price from CJ
- [ ] Delete products

### Phase 5: Remove Local Products ⏳
- [ ] Remove "Add Local Product" link from admin
- [ ] Hide local product add/edit pages
- [ ] Update product list to show only CJ products
- [ ] Remove WhatsApp ordering components

### Phase 6: Store Front ⏳
- [ ] Update homepage to show only CJ products
- [ ] Update `/products` page (CJ only)
- [ ] Update `/products/[id]` page (CJ only)
- [ ] Remove local product filters
- [ ] Show only selling price (hide supplier/profit)

### Phase 7: Cart & Checkout ⏳
- [ ] Update cart to handle CJ products
- [ ] Add quantity management
- [ ] Create checkout page
- [ ] Customer info form
- [ ] Payment method selection (Nigeria/International)
- [ ] Currency selection (NGN/USDT)
- [ ] Order confirmation

### Phase 8: Orders Management ⏳
- [ ] Update orders table schema (add currency, payment_method)
- [ ] Update admin orders page
- [ ] Show payment method
- [ ] Show currency
- [ ] Update payment status
- [ ] Update order status
- [ ] Verify payments

---

## 🗂️ File Structure

```
marketnest/
├── lib/
│   ├── cjService.ts ✅ (Updated)
│   └── cartHelpers.ts (New)
├── app/
│   ├── api/
│   │   └── cj/
│   │       ├── products/
│   │       │   ├── search/route.ts ✅
│   │       │   ├── import/route.ts ✅
│   │       │   ├── details/route.ts (New)
│   │       │   └── refresh/route.ts (New)
│   │       └── test-connection/route.ts ✅
│   ├── admin/
│   │   ├── cj-products/
│   │   │   └── page.tsx (New)
│   │   ├── imported-products/
│   │   │   └── page.tsx (New)
│   │   └── orders/
│   │       └── page.tsx (Update)
│   ├── products/
│   │   ├── page.tsx (Update - CJ only)
│   │   └── [id]/page.tsx (Update - CJ only)
│   ├── cart/
│   │   └── page.tsx (Update)
│   ├── checkout/
│   │   └── page.tsx (New)
│   └── components/
│       ├── ProductCard.tsx (Update - CJ only)
│       ├── CartItem.tsx (New)
│       └── CheckoutForm.tsx (New)
└── CJ_PRODUCTS_MIGRATION.sql ✅
```

---

## 🔄 Implementation Steps

### Step 1: Run Database Migration
```sql
-- In Supabase SQL Editor
-- Run: CJ_PRODUCTS_MIGRATION.sql
```

### Step 2: Test CJ API
1. Go to `/admin/cj-test`
2. Verify connection works
3. Check token is displayed

### Step 3: Create Admin Pages
1. CJ Products search page
2. Imported Products management page
3. Update Orders page

### Step 4: Update Store Front
1. Update product pages to show only CJ
2. Hide supplier/profit information
3. Show only selling price

### Step 5: Implement Cart & Checkout
1. Update cart system
2. Create checkout flow
3. Payment method selection
4. Order creation

---

## 💾 Database Schema Changes

### Products Table (Existing + New Column)
```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY,
  cj_pid TEXT UNIQUE,              -- NEW: CJ Product ID
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  supplier_price DECIMAL(10, 2),
  profit_amount DECIMAL(10, 2),    -- Used instead of markup_percentage
  selling_price DECIMAL(10, 2),
  category TEXT,
  stock INTEGER,
  product_type TEXT,               -- Will be 'cj' only
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Orders Table (Update Schema)
```sql
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- payment_method values: 'bank_transfer', 'crypto'
-- currency values: 'NGN', 'USDT'
```

---

## 🎯 Key Features

### Admin - CJ Products Page
- Search CJ products
- Filter by Electronics category
- Display:
  - Product image
  - Title
  - Supplier price
  - Stock
  - Description
- "Add to Store" button
- Import modal:
  - Set profit amount
  - Auto-calculate selling price
  - Save to database

### Admin - Imported Products
- List all CJ products in store
- Edit profit amount (auto-recalculates price)
- Refresh stock from CJ
- Refresh price from CJ
- Delete products
- Prevent duplicate imports

### Store Front
- Show only CJ products
- Display:
  - Product image
  - Title
  - Selling price (no supplier price)
  - Stock status
  - "Add to Cart" button
- Product details page
- Cart functionality
- Checkout process

### Checkout Flow
```
1. Customer fills form:
   - Name
   - Email
   - Phone
   - Address
   - Country

2. Choose payment method:
   - Nigeria → Bank Transfer (NGN)
   - International → Crypto (USDT)

3. Review order

4. Confirm and place order

5. Save to orders table

6. Show confirmation
```

---

## 🚫 What to Remove/Hide

### Remove from Admin:
- [x] "Add Local Product" functionality
- [ ] Local product add/edit pages
- [ ] WhatsApp ordering features
- [ ] Local product management

### Hide from Store:
- [ ] "Message on WhatsApp" buttons
- [ ] Local product filters
- [ ] Supplier price display
- [ ] Profit amount display
- [ ] Local product categories

---

## 📊 Profit Calculation

```typescript
// Simple formula
selling_price = supplier_price + profit_amount

// Example:
supplier_price = $20
profit_amount = $8
selling_price = $28

// When supplier price changes:
new_selling_price = new_supplier_price + profit_amount
```

---

## 🔐 Security Considerations

1. **API Keys**: CJ_API_KEY remains in .env.local (server-side only)
2. **Product Import**: Check for duplicates using cj_pid
3. **Price Updates**: Only admins can modify prices
4. **Order Creation**: Validate all customer data
5. **Payment Verification**: Admin must verify payments manually

---

## 🎨 UI/UX Requirements

### Design:
- Modern, premium e-commerce look
- Responsive (mobile, tablet, desktop)
- Smooth animations
- Loading states everywhere
- Error handling with clear messages

### Components:
- Skeleton loaders
- Empty states
- Success notifications
- Confirmation dialogs
- Form validation
- Toast notifications

---

## 📝 Next Steps

Due to the large scope, I recommend implementing in phases:

**Phase 1** (Priority):
1. Run database migration
2. Create CJ Products admin page
3. Test product import

**Phase 2**:
4. Create Imported Products page
5. Update store front

**Phase 3**:
6. Implement cart & checkout
7. Update orders system

---

## ⚠️ Important Notes

1. **Database Migration**: Must run `CJ_PRODUCTS_MIGRATION.sql` first
2. **CJ API Limits**: Be aware of rate limits
3. **Product Duplicates**: System prevents duplicate imports
4. **Price Sync**: Implement scheduled refresh for prices/stock
5. **Order Fulfillment**: Manual process (send orders to CJ separately)

---

## 🎯 Success Criteria

- [ ] Can search CJ products
- [ ] Can import products with custom profit
- [ ] Can edit profit and auto-recalculate price
- [ ] Store shows only CJ products
- [ ] Cart works with CJ products
- [ ] Checkout collects all required info
- [ ] Orders save to database correctly
- [ ] Admin can manage orders
- [ ] No local product features visible

---

**Implementation Status**: In Progress  
**Priority**: Phase 1 - Core CJ Product Management  
**Estimated Time**: 2-3 hours for full implementation
