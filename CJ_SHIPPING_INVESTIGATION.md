# CJ Shipping Price Discrepancy Investigation

**Status:** INVESTIGATING  
**Date:** August 13, 2026  

---

## 🔴 Problem Statement

### Observed Discrepancy:
**CJ Website for the same product:**
- Product Price: $1.76
- US Shipping Fee: $8.28
- **Total Dropshipping Price: $10.04**

**MarketNest currently shows:**
- Product Price: $1.76 ✅ (Correct)
- US Shipping Fee: $7.10 ❌ (WRONG - should be $8.28)
- **US Dropshipping Cost: $8.86** ❌ (WRONG - should be $10.04)

**Difference:** $8.28 - $7.10 = **$1.18 underpricing**

---

## 🔍 Root Cause Analysis

### Current Implementation:
The system uses a **weight-based estimation formula**:
```
Shipping Fee = $5 base + ($0.015 × weight_in_grams)
Min: $5, Max: $50
```

### Why $7.10?
```
$7.10 - $5 base = $2.10
$2.10 ÷ $0.015 = 140 grams

Product weight ≈ 140g
Estimated shipping = $5 + (140 × $0.015) = $7.10
```

### Why This is Wrong:
- ❌ The formula is our **guess**, not CJ's actual pricing
- ❌ CJ uses different pricing models (volume, dimensions, shipping method, destination zones)
- ❌ Weight alone doesn't capture CJ's full shipping calculation
- ❌ Result: We undercharge customers by $1.18 per unit

---

## 🎯 Investigation Goals

1. **Find the correct CJ API endpoint/parameters** that return $8.28 for US shipping
2. **Identify what factors** CJ uses besides weight (shipping method, dimensions, zones, etc.)
3. **Understand API response structure** - where is the shipping fee located?
4. **Match CJ website's calculation** - replicate their exact logic

---

## 🛠️ Investigation Tools Created

### 1. Debug API Endpoint
**File:** `app/api/cj/debug-shipping/route.ts`

**What it does:**
- Calls CJ freight calculation API with different parameters
- Queries product details to see available shipping info
- Tests different shipping methods
- Logs all request/response data for analysis

**Tests Performed:**
1. ✅ Basic freight calculate (current method)
2. ✅ Product details query (check for shipping fields)
3. ✅ Freight calculate with specific shipping method
4. ✅ Get available shipping methods list

### 2. Debug Admin Page
**File:** `app/admin/debug-cj-shipping/page.tsx`

**How to use:**
1. Go to `/admin/debug-cj-shipping`
2. Enter the product PID (the one showing $8.28 on CJ website)
3. Click "Debug Shipping"
4. Review all API responses
5. Look for shipping fee fields

**What to look for:**
- Any response returning $8.28
- Field names: `freightFee`, `shippingFee`, `logisticFee`, `freight`, `fee`
- Available shipping methods and their prices
- Product dimensions, volume weight calculations
- Warehouse location, shipping zones

---

## 📋 Investigation Steps

### Step 1: Get the Problematic Product PID
You need to provide:
- ✅ Product PID (e.g., `CJYD3046124VM55`)
- ✅ Confirm it shows $8.28 shipping on CJ website
- ✅ Confirm it shows $7.10 in MarketNest

### Step 2: Run Debug Tool
1. Navigate to: `https://your-site.vercel.app/admin/debug-cj-shipping`
2. Enter the PID
3. Click "Debug Shipping"
4. Check browser console for detailed logs
5. Check Vercel Function Logs for server-side logs

### Step 3: Analyze API Responses
Look for:
```json
{
  "data": {
    "freightFee": 8.28,  // ← We need this!
    "shippingMethod": "CJPACKET_SA",
    "logisticId": "...",
    // ... other fields
  }
}
```

### Step 4: Identify Missing Parameters
CJ might need:
- ✅ Specific shipping method code
- ✅ Warehouse ID
- ✅ Product variant ID
- ✅ Dimensions (length × width × height)
- ✅ Volume weight vs actual weight
- ✅ Destination postal code/state
- ✅ Quantity-based pricing

### Step 5: Update Implementation
Once we find the correct API call:
1. Update `calculateUSShippingFee()` function
2. Add missing parameters
3. Parse correct response fields
4. Test with multiple products
5. Verify results match CJ website

---

## 🔬 Hypotheses to Test

### Hypothesis 1: Missing Shipping Method Parameter
**Theory:** CJ calculates different rates for different shipping methods  
**Test:** Try specifying `shippingMethod: "CJPACKET_SA"` (standard) or other methods  
**Expected:** Different methods return different prices, one matches $8.28

### Hypothesis 2: Volume Weight Calculation
**Theory:** CJ uses volume weight (L × W × H ÷ divisor) instead of actual weight  
**Test:** Check product dimensions and calculate volume weight  
**Expected:** Volume weight > actual weight, explains higher price

### Hypothesis 3: Wrong API Endpoint
**Theory:** `/logistic/freightCalculate` isn't the right endpoint for dropshipping prices  
**Test:** Try `/product/query` or other endpoints for shipping data  
**Expected:** Different endpoint has the correct $8.28 value

### Hypothesis 4: Multi-Step Calculation
**Theory:** Need to get available shipping methods first, then calculate  
**Test:** Call shipping methods list, then calculate with specific method  
**Expected:** Two-step process returns accurate price

### Hypothesis 5: Destination-Specific Parameters
**Theory:** Need to specify US state/postal code for accurate pricing  
**Test:** Add destination details to request  
**Expected:** More specific location returns $8.28

---

## 📊 Expected API Response Structure

Based on CJ documentation, we expect:

```json
{
  "code": 200,
  "result": true,
  "message": "success",
  "data": {
    "logisticId": "12345",
    "logisticName": "CJPacket Standard",
    "logisticCode": "CJPACKET_SA",
    "freightFee": 8.28,        // ← The value we need
    "currency": "USD",
    "deliveryTime": "15-30",
    "trackingAvailable": true,
    "shippingMethod": "air",
    "products": [
      {
        "pid": "...",
        "quantity": 1,
        "weight": 140,           // Actual weight
        "volumeWeight": 250,     // Volume weight (might be higher!)
        "chargedWeight": 250     // Weight used for calculation
      }
    ]
  }
}
```

**Key Field:** `data.freightFee` or `data.shippingFee`

---

## ⚠️ Important Notes

### DO NOT:
- ❌ Hardcode $8.28 as the shipping fee
- ❌ Add a fixed "$1.18 correction factor"
- ❌ Keep using the weight-based estimate
- ❌ Deploy any changes until root cause is found

### DO:
- ✅ Find the actual API parameter/endpoint that returns $8.28
- ✅ Test with multiple products to verify the solution works generally
- ✅ Document the correct API call parameters
- ✅ Update the implementation to use real CJ data
- ✅ Verify results match CJ website for at least 5 different products

---

## 🧪 Testing Protocol

### After Finding the Solution:

1. **Test Product 1:** The original $8.28 product
   - Verify API returns $8.28
   - Verify MarketNest calculates $10.04 total

2. **Test Product 2:** A lightweight product (<100g)
   - Compare CJ website shipping vs our calculation
   - Verify they match

3. **Test Product 3:** A heavy product (>1kg)
   - Compare CJ website shipping vs our calculation
   - Verify they match

4. **Test Product 4:** A large/bulky product
   - Compare CJ website shipping vs our calculation
   - Verify volume weight is handled correctly

5. **Test Product 5:** A free shipping product
   - Verify $0 shipping is correctly identified
   - Verify total = product price only

### Success Criteria:
- ✅ All 5 products match CJ website within $0.10
- ✅ No hardcoded values
- ✅ Solution works for any product
- ✅ Clear documentation of API parameters used

---

## 📞 Next Steps

1. **User provides:** Product PID showing $8.28 on CJ website
2. **Run debug tool:** Test all API variations
3. **Analyze responses:** Find where $8.28 appears
4. **Identify solution:** Correct API endpoint/parameters
5. **Update code:** Implement the fix
6. **Test thoroughly:** Verify with 5+ products
7. **Deploy:** Push to production
8. **Verify:** Check imported products have correct pricing

---

## 🔗 Related Files

- `lib/cjService.ts` - Main CJ API service (needs updating)
- `app/api/cj/products/us-pricing/route.ts` - Pricing API endpoint
- `app/admin/cj-products/page.tsx` - Product import page
- `app/api/cj/debug-shipping/route.ts` - NEW: Debug tool
- `app/admin/debug-cj-shipping/page.tsx` - NEW: Debug UI

---

**Status:** Waiting for product PID to begin investigation 🔍
