# 🛍️ MarketNest Product Types Guide

## Overview

MarketNest now supports two distinct product types with different workflows:

1. **Local Products** - Manually managed, WhatsApp orders
2. **CJ Products** - API-fetched, auto-priced, cart checkout

---

## 🇳🇬 Local Products

### Characteristics
- **Manually added** by admin
- **Manually priced** by admin (no pricing calculator)
- **WhatsApp order flow** only
- **Full CRUD** - Admin can add, edit, delete anytime

### Product Fields
- ✅ Title
- ✅ Description
- ✅ Image URL
- ✅ **Selling Price** (manually set)
- ✅ Category
- ✅ Stock
- ❌ NO supplier_price
- ❌ NO markup_percentage
- ❌ NO automatic pricing

### Button Behavior
**Button Text:** "Message on WhatsApp"

**On Click:**
- Checks if user is logged in
- Opens WhatsApp with pre-filled message
- Message includes product details

### Admin Actions
- ✅ Add new local products
- ✅ Edit existing local products
- ✅ Delete local products
- ✅ Update stock manually
- ✅ Set custom prices

---

## 🌍 CJ Products (CJDropShipping)

### Characteristics
- **NOT manually created** by admin
- **Fetched from CJDropShipping API** (future integration)
- **Auto-priced** with markup percentage
- **Cart + Checkout system**
- **View-only** for admin (can't edit/delete)

### Product Fields
- ✅ Title (from API)
- ✅ Description (from API)
- ✅ Image URL (from API)
- ✅ **Supplier Price** (from API)
- ✅ **Markup Percentage** (set by admin)
- ✅ **Selling Price** (auto-calculated)
- ✅ Category (from API)
- ✅ Stock (from API)

### Pricing Logic
```
selling_price = supplier_price + (supplier_price * markup_percentage / 100)
```

**Example:**
- Supplier Price: $10,000
- Markup: 40%
- **Selling Price: $14,000** (auto-calculated)

### Button Behavior
**Button Text:** "Add to Cart"

**On Click:**
- Checks if user is logged in
- Adds product to shopping cart
- User proceeds to checkout
- Payment via Paystack (future)

### Admin Actions
- ❌ Cannot manually create CJ products
- ❌ Cannot edit CJ products
- ❌ Cannot delete CJ products
- ✅ Can set markup percentage (future)
- ✅ Can refresh product data from API (future)

---

## 📊 Comparison Table

| Feature | Local Products | CJ Products |
|---------|---------------|-------------|
| **Source** | Manual entry | CJDropShipping API |
| **Pricing** | Manual | Auto-calculated |
| **Order Flow** | WhatsApp | Cart + Checkout |
| **Admin CRUD** | Full control | View only |
| **Button** | "Message on WhatsApp" | "Add to Cart" |
| **Payment** | Cash on delivery | Paystack (future) |
| **Supplier Price** | Not used | From API |
| **Markup %** | Not used | Set by admin |

---

## 🎯 User Experience

### For Local Products
1. User browses products
2. Clicks "Message on WhatsApp"
3. WhatsApp opens with pre-filled message
4. User chats with seller
5. Order arranged via WhatsApp
6. Payment on delivery

### For CJ Products
1. User browses products
2. Clicks "Add to Cart"
3. Product added to cart
4. User proceeds to checkout
5. Fills delivery form
6. Pays via Paystack (future)
7. Order fulfilled by CJDropShipping

---

## 🔧 Admin Dashboard

### Products Management Page

**Filter Tabs:**
- All Products (total count)
- 🇳🇬 Local Products (count)
- 🌍 CJ Products (count)

**Info Boxes:**
- **Local Products:** "Manually added, manually priced, WhatsApp orders. Full CRUD control."
- **CJ Products:** "From CJDropShipping API, auto-priced with markup, cart checkout system."

**Product Cards:**
- **Local:** Shows Edit + Delete buttons
- **CJ:** Shows "CJ Product (View Only)" badge

---

## 📝 Adding Products

### Adding Local Products

1. Go to `/admin/products/add`
2. Select **"🇳🇬 Local Product"**
3. Fill in:
   - Title
   - Description
   - Image URL
   - **Selling Price** (manual)
   - Category
   - Stock
4. Click "Add Product"

**Pricing Section:**
- Simple selling price input
- No supplier price
- No markup calculator
- Set your own price

### Adding CJ Products

**NOT AVAILABLE YET**

CJ products will be automatically fetched from the CJDropShipping API in a future update. Admin will be able to:
- Browse CJ catalog
- Select products to import
- Set markup percentage
- Products auto-sync

---

## 🚀 Future CJDropShipping Integration

### Planned Features

1. **API Connection**
   - Connect to CJDropShipping API
   - Authenticate with API key
   - Fetch product catalog

2. **Product Import**
   - Browse CJ products
   - Filter by category
   - Select products to import
   - Set global or per-product markup

3. **Auto-Sync**
   - Stock levels sync automatically
   - Price updates from supplier
   - Product availability

4. **Order Fulfillment**
   - Orders auto-sent to CJ
   - Tracking numbers received
   - Automatic status updates

5. **Markup Management**
   - Set default markup percentage
   - Override per product
   - Bulk markup updates

---

## 💡 Best Practices

### For Local Products
- Use clear, descriptive titles
- Add high-quality images
- Set competitive prices
- Keep stock updated
- Respond quickly on WhatsApp

### For CJ Products (Future)
- Set reasonable markup percentages
- Monitor supplier price changes
- Keep product descriptions updated
- Track order fulfillment times
- Manage customer expectations

---

## 🐛 Troubleshooting

### Local Products Not Showing
- Check product_type = 'local' in database
- Verify stock > 0
- Check if product was deleted

### CJ Products Not Showing
- CJ products not yet implemented
- Will appear after API integration
- Check back for updates

### Wrong Button Showing
- Verify product_type in database
- Should be 'local' or 'cj'
- Check ProductCard component

### Pricing Calculator Not Working
- Only works for CJ products
- Local products use manual pricing
- Check product type selection

---

## 📊 Database Schema

### Products Table

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  
  -- Pricing (CJ products only)
  supplier_price DECIMAL(10, 2),      -- NULL for local
  markup_percentage DECIMAL(5, 2),    -- NULL for local
  profit_amount DECIMAL(10, 2),       -- NULL for local
  
  -- Final price (both types)
  selling_price DECIMAL(10, 2) NOT NULL,
  
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  
  -- Product type
  product_type TEXT NOT NULL CHECK (product_type IN ('local', 'cj')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);
```

---

## 🎨 UI Components

### ProductCard Component
- Shows correct button based on product_type
- "Message on WhatsApp" for local
- "Add to Cart" for CJ
- Different colors for each type

### Admin Products Page
- Filter tabs (All, Local, CJ)
- Info boxes explaining each type
- Different actions for each type
- Visual distinction with badges

### Add Product Page
- Product type selector at top
- Different pricing sections
- Local: Simple price input
- CJ: Full pricing calculator

---

## 📞 Support

For questions or issues:
1. Check this guide first
2. Review the code comments
3. Test with sample products
4. Check database values

---

**Last Updated:** May 14, 2026
**Status:** Local products ✅ | CJ products 🚧 (coming soon)
