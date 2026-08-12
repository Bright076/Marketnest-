# CJ Dropshipping Pricing Fix - Implementation Plan

## Problem
Currently, MarketNest uses only the `sellPrice` field from CJ API, which represents the **product/unit price** only.

This does NOT include shipping costs, which means our profit calculations are incorrect.

### Example:
- CJ Product Price: $1.76
- **US Shipping Fee: $8.28** (must fetch from CJ for each product)
- **US Dropshipping Cost: $10.04** (product price + US shipping)

Currently, we're using $1.76 as supplier_price, which is WRONG.
We should use $10.04 as supplier_price.

## Requirements (CONFIRMED)

1. **Standard Reference Market**: United States (US)
2. **Supplier Price Calculation**: `supplier_price = product_price + US_shipping_fee`
3. **No Hardcoding**: Fetch actual US shipping fee from CJ API for each product
4. **Fixed Market**: Always use US shipping, regardless of customer's country
5. **Selling Price**: `selling_price = supplier_price + profit_amount`
6. **Admin UI**: Clearly display calculated US dropshipping price before save

## Solution

### Step 1: Understand CJ API Structure

According to CJ Dropshipping API documentation, product pricing works like this:

1. **Product List API** (`/product/list`) returns:
   - `sellPrice`: Unit/product price only (e.g., $1.76)
   - Does NOT include shipping

2. **Product Query API** (`/product/query`) can return:
   - More detailed product information
   - May include `freightFee` or shipping-related fields
   - May have `variants` with different prices

3. **Calculate Shipping API** (`/logistic/freightCalculate`) provides:
   - Exact shipping cost based on:
     - Destination country
     - Product weight
     - Shipping method
     - Quantity

### Step 2: Current vs Correct Flow

#### Current (WRONG) Flow:
```
1. Fetch product from /product/list
2. Get sellPrice = $1.76
3. Use $1.76 as supplier_price
4. Calculate: selling_price = $1.76 + profit
5. Customer pays (e.g.) $6.76
6. We order from CJ, pay $10.04
7. LOSS: $3.28 per order!
```

#### Correct Flow:
```
1. Fetch product from /product/list (get basic info)
2. Fetch US shipping fee for this product
3. Calculate: US_dropshipping_price = product_price + US_shipping_fee
4. Use US_dropshipping_price as supplier_price
5. Calculate: selling_price = supplier_price + profit
6. Display in admin UI for verification
7. Save product with correct supplier_price
8. Customer buys (from any country)
9. We order from CJ using US supplier_price
10. We make correct profit!
```

**IMPORTANT**: 
- Always use US as the reference country for shipping calculation
- Do NOT change supplier_price based on customer's country
- Fetch actual shipping fee from CJ API (no hardcoding)

## Implementation Steps

### Step 1: Add US Shipping Calculation Function
Create new function in `lib/cjService.ts`:
```typescript
export async function getCJProductUSShippingFee(params: {
  pid: string;
  quantity?: number; // Default: 1
}): Promise<{
  productPrice: number;
  usShippingFee: number;
  usDropshippingPrice: number;
}>;
```

This function will:
1. Fetch product details to get weight and base price
2. Call CJ shipping calculation API for US destination
3. Return product price, US shipping fee, and total US dropshipping price

### Step 2: Update Product Import Flow
When admin clicks "Import" on a CJ product:
1. Call `getCJProductUSShippingFee(pid)`
2. Display breakdown in modal:
   - Product Price: $1.76
   - US Shipping: $8.28
   - **US Dropshipping Price: $10.04** ← Clearly highlighted
3. Use $10.04 as `supplier_price` (not $1.76)
4. Calculate selling price: $10.04 + profit

### Step 3: Update Admin UI
The import modal must show:
```
📦 Pricing Breakdown (US Market Reference)

Product Price:           $1.76
US Shipping Fee:        +$8.28
═══════════════════════════════
US Dropshipping Cost:    $10.04  ← This becomes supplier_price

Your Profit:            +$5.00
────────────────────────────────
Selling Price:          $15.04

Note: Supplier price includes US shipping. 
Customer's country does not affect this base cost.
```

### Step 4: Database Fields
Use these fields in products table:
- `supplier_price`: **US dropshipping price** (product + US shipping) ← Main field
- Optional reference fields for debugging:
  - `cj_product_price`: Product price only
  - `cj_us_shipping`: US shipping fee only
  - `cj_pid`: CJ Product ID

## API Endpoints to Use

### 1. Get Product Details
```
POST /api2.0/v1/product/query
Body: { "pid": "CJYD3046124VM55" }
Response includes: sellPrice, productWeight, variants
```

### 2. Calculate Shipping (if available)
```
POST /api2.0/v1/logistic/freightCalculate
Body: {
  "products": [{ "pid": "...", "quantity": 1 }],
  "country": "US",
  "logisticName": "CJ Packet" // or other shipping method
}
Response: { "freightFee": 8.28 }
```

## Testing Plan

1. **Test on development**:
   - Import a product
   - Verify shipping calculation works
   - Check total dropshipping price is correct

2. **Verify calculations**:
   - Product price + shipping = supplier_price
   - selling_price = supplier_price + profit_amount
   - Profit calculation is accurate

3. **Handle edge cases**:
   - Products with free shipping
   - Products with multiple variants (different weights)
   - Products unavailable for certain countries

## Fallback Strategy

If shipping calculation API is not available or fails:
1. Use a conservative shipping estimate based on product weight
2. Add warning message in admin UI
3. Allow manual adjustment of supplier_price

## Next Actions

1. ✅ Document the problem
2. ⏳ Test CJ API endpoints to verify available fields
3. ⏳ Implement shipping calculation
4. ⏳ Update import flow
5. ⏳ Update admin UI
6. ⏳ Test thoroughly
7. ⏳ Deploy to production

---

**Priority**: HIGH - This affects profit margins on every order!
**Risk**: CRITICAL - Currently losing money on orders!
