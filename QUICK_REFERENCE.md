# 🚀 MarketNest Quick Reference

## Product Types at a Glance

### 🇳🇬 Local Products
- **Add:** Manual entry by admin
- **Price:** Set by admin (no calculator)
- **Button:** "Message on WhatsApp"
- **Order:** WhatsApp chat
- **Admin:** Full CRUD (add, edit, delete)

### 🌍 CJ Products
- **Add:** From CJDropShipping API (future)
- **Price:** Auto-calculated (supplier + markup%)
- **Button:** "Add to Cart"
- **Order:** Cart → Checkout → Payment
- **Admin:** View only (no edit/delete)

---

## Quick Commands

### Add Local Product
1. `/admin/products/add`
2. Select "🇳🇬 Local Product"
3. Enter selling price manually
4. Save

### Add CJ Product (Testing)
1. `/admin/products/add`
2. Select "🌍 CJ Product"
3. Enter supplier price + markup%
4. Selling price auto-calculates
5. Save

### Filter Products
- `/admin/products` → Use filter tabs
- All | Local | CJ

---

## Button Behavior

| Product Type | Button Text | Action |
|--------------|-------------|--------|
| Local | "Message on WhatsApp" | Opens WhatsApp |
| CJ | "Add to Cart" | Adds to cart |

---

## Pricing

### Local
```
Selling Price = $100 (manual)
```

### CJ
```
Supplier: $10,000
Markup: 40%
Selling: $14,000 (auto)
```

---

## Admin Actions

| Action | Local | CJ |
|--------|-------|-----|
| Add | ✅ Yes | 🚧 API only |
| Edit | ✅ Yes | ❌ No |
| Delete | ✅ Yes | ❌ No |
| View | ✅ Yes | ✅ Yes |

---

## Files Changed

1. `app/components/ProductCard.tsx`
2. `app/admin/products/add/page.tsx`
3. `app/admin/products/page.tsx`

---

## Documentation

- **Full Guide:** `PRODUCT_TYPES_GUIDE.md`
- **Update Summary:** `PRODUCT_UPDATE_SUMMARY.md`
- **This Reference:** `QUICK_REFERENCE.md`

---

**Status:** ✅ Ready to use!
