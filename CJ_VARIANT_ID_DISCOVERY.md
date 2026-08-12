# 🔍 CJ Shipping Investigation - CRITICAL DISCOVERY

**Product PID:** `CJJJJTJT00130`  
**Status:** ROOT CAUSE IDENTIFIED  
**Date:** August 13, 2026  

---

## 🎯 CRITICAL FINDING

### CJ API Requires **Variant ID (vid)**, Not Just Product ID (pid)!

```json
{
  "code": 1600300,
  "result": false,
  "message": "vid or variantSku must be not empty"
}
```

**This is why we're getting wrong shipping costs!**

---

## 📊 Debug Results Analysis

### Test 1: Basic Freight Calculate (FAILED)
**Request:**
```json
{
  "startCountryCode": "CN",
  "endCountryCode": "US",
  "products": [{
    "pid": "CJJJJTJT00130",
    "quantity": 1
  }]
}
```

**Response:** ❌ Error 1600300
```
"message": "vid or variantSku must be not empty"
```

**Analysis:**
- CJ freight API does NOT accept just `pid`
- Requires `vid` (variant ID) or `variantSku` (variant SKU)
- Products have variants (size, color, etc.)
- Each variant has different shipping!

###Test 2: Product Query (WRONG METHOD)
**Response:** ❌ Error 16900202
```
"message": "Request method 'POST' not supported"
```

**Analysis:**
- `/product/query` endpoint uses wrong HTTP method
- Should use `/product/list` with POST instead
- Need to get variants from product list

### Test 3: Rate Limited
**Response:** ❌ Error 1600200
```
"message": "Too Many Requests, QPS limit is 1 time/1second"
```

**Analysis:**
- CJ limits API to 1 request per second
- Need delays between API calls
- Fixed in updated debug tool

---

## 🔧 Solution Implemented

### Updated Debug Tool:
1. ✅ Use `/product/list` API to get product variants
2. ✅ Extract variant IDs (`vid`) from response
3. ✅ Call freight calculate with `vid` instead of `pid`
4. ✅ Add 1.5 second delays to avoid rate limits
5. ✅ Test all variants to find the one matching CJ website

### Expected Workflow:
```
Step 1: Get Product → Extract Variants
POST /product/list
Body: { "pid": "CJJJJTJT00130" }

Response:
{
  "data": {
    "list": [{
      "variants": [
        {
          "vid": "VARIANT_ID_1",
          "variantSku": "SKU_1",
          "variantName": "Black - Medium",
          "variantSellPrice": 1.76
        },
        {
          "vid": "VARIANT_ID_2",
          "variantSku": "SKU_2",
          "variantName": "Black - Large",
          "variantSellPrice": 1.76
        }
      ]
    }]
  }
}

Step 2: Calculate Shipping for Each Variant
POST /logistic/freightCalculate
Body: { "vid": "VARIANT_ID_1", "endCountryCode": "US" }

Response:
{
  "data": {
    "freightFee": 8.28  // ← The correct shipping!
  }
}
```

---

## ⚠️ Why This Caused $7.10 vs $8.28 Discrepancy

### Our Old Approach:
```
1. Get product PID
2. Get product weight (140g)
3. Estimate shipping: $5 + (140 × $0.015) = $7.10
4. WRONG because:
   - Ignores variant-specific weights
   - Ignores variant-specific dimensions
   - Ignores actual CJ shipping calculation
```

### Correct Approach:
```
1. Get product PID
2. Get ALL variants for that product
3. User selects which variant (or use first if only one)
4. Call freight API with VARIANT ID (vid)
5. Use CJ's actual shipping fee (e.g., $8.28)
6. Correct total: $1.76 + $8.28 = $10.04
```

---

## 🚀 Next Steps

### 1. Re-Run Debug Tool (URGENT)
After deployment completes:
- Go to `/admin/debug-cj-shipping`
- Enter PID: `CJJJJTJT00130`
- Updated tool will now:
  - Get variants
  - Calculate shipping for each variant
  - Show which variant has $8.28 shipping

### 2. Expected New Results:
```json
{
  "tests": {
    "productDetails": {
      "variantsFound": 2,  // or however many
      "variants": [
        { "vid": "...", "variantName": "...", "price": 1.76 },
        { "vid": "...", "variantName": "...", "price": 1.76 }
      ]
    },
    "withVariantId": {
      "response": {
        "data": {
          "freightFee": 8.28  // ← Hopefully this!
        }
      }
    }
  }
}
```

### 3. Update Product Import Flow
Once we confirm vid works:

**Current (WRONG):**
```typescript
// ❌ Old way - uses weight estimate
const shipping = calculateWeightBased(productWeight);
```

**New (CORRECT):**
```typescript
// ✅ New way - uses CJ actual freight with vid
const variants = product.variants;
const firstVariant = variants[0];  // or user selects
const freight = await calculateUSShipping(firstVariant.vid);
```

### 4. Update Code Files:

**Files to modify:**
- `lib/cjService.ts`:
  - Update `calculateUSShippingFee()` to accept `vid` param
  - Use `vid` instead of `pid` in freight API call
  
- `lib/cjService.ts`:
  - Update `getCJProductUSDropshippingPrice()` to accept `vid`
  - Pass `vid` to shipping calculation
  
- `app/api/cj/products/us-pricing/route.ts`:
  - Accept `vid` in request body
  - Pass `vid` to `getCJProductUSDropshippingPrice()`
  
- `app/admin/cj-products/page.tsx`:
  - Show variants dropdown if product has multiple
  - Pass selected `vid` to pricing API
  - Display variant info in UI

---

## 📋 Implementation Checklist

- [x] Identified root cause: Need vid not pid
- [x] Updated debug tool to use vid
- [x] Deployed updated debug tool
- [ ] Re-run debug with CJJJJTJT00130
- [ ] Confirm $8.28 returned with vid
- [ ] Update `calculateUSShippingFee()` function
- [ ] Update `getCJProductUSDropshippingPrice()` function
- [ ] Update pricing API endpoint
- [ ] Update admin import UI for variants
- [ ] Test with 5+ products
- [ ] Delete old products
- [ ] Re-import with correct vid-based pricing
- [ ] Verify supplier_price matches CJ website

---

## 💡 Key Insights

### Products Have Variants
- Most CJ products have variants (size, color, style)
- Each variant has its own:
  - Variant ID (vid)
  - Variant SKU
  - Price (sometimes differs)
  - Weight & dimensions
  - **Shipping cost**

### Shipping Varies by Variant
- Same product, different variants → different shipping
- Large size → heavier → more shipping
- Variant with battery → restricted shipping → more cost
- **Must calculate shipping per variant, not per product!**

### CJ API Structure
```
Product (PID)
├── Variant 1 (vid_1) → Shipping $7.50
├── Variant 2 (vid_2) → Shipping $8.28  ← The one on CJ website
└── Variant 3 (vid_3) → Shipping $9.00
```

---

## 🔗 Related Files

**Already Updated:**
- ✅ `app/api/cj/debug-shipping/route.ts` - Now uses vid
- ✅ `app/admin/debug-cj-shipping/page.tsx` - Will show variants

**Need Updating:**
- ⏳ `lib/cjService.ts` - `calculateUSShippingFee(vid)` not `(pid)`
- ⏳ `lib/cjService.ts` - `getCJProductUSDropshippingPrice(params)` needs vid
- ⏳ `app/api/cj/products/us-pricing/route.ts` - Accept vid parameter
- ⏳ `app/admin/cj-products/page.tsx` - Variant selection UI

---

## ⏰ Action Required

**PLEASE RE-RUN DEBUG TOOL** after deployment:

1. Wait for Vercel deployment to complete (commit: `a7112b9`)
2. Go to `/admin/debug-cj-shipping`
3. Enter PID: `CJJJJTJT00130`
4. Click "Debug Shipping"
5. Share the new results

The updated tool will now:
- ✅ Get product variants
- ✅ Use vid for freight calculation
- ✅ Add delays to avoid rate limits
- ✅ Show shipping for each variant
- ✅ Hopefully return $8.28!

---

**Status:** Waiting for re-run with updated debug tool 🚀
