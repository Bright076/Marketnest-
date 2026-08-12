# CJ US Dropshipping Price - Action Plan

## Clear Requirements

### What We Need:
1. **Product Price**: From CJ API (e.g., $1.76)
2. **US Shipping Fee**: From CJ API for US destination (e.g., $8.28)
3. **US Dropshipping Price**: product_price + us_shipping_fee (e.g., $10.04)
4. **Save as**: `supplier_price = $10.04` (NOT $1.76)

### Rules:
- ✅ Always use US as reference market
- ✅ Fetch actual US shipping from CJ (no hardcoding)
- ✅ Display clearly in admin UI before saving
- ❌ Do NOT use product price alone as supplier_price
- ❌ Do NOT change based on customer's country

## Step 1: Inspect CJ API Response (FIRST!)

**DO THIS NOW**:
1. Go to `/admin/cj-fetch-test`
2. Click "Fetch 10 Products from CJ"
3. Look at the JSON response for these fields:

### Fields to Find:
```json
{
  "pid": "...",
  "sellPrice": X.XX,           // ← Product price
  "productWeight": X.XX,        // ← Needed for shipping calc
  "freightFee": ?,              // ← US shipping (if exists)
  "totalPrice": ?,              // ← Total US price (if exists)
  "logisticInfo": {},           // ← Shipping info (if exists)
  "variants": []                // ← May have variant prices
}
```

### What We're Looking For:

**Scenario A**: US shipping fee is already in the response
- Field name: `freightFee`, `shippingFeeUS`, `usShipping`, etc.
- ✅ If found: Use directly
- Implementation: Simple calculation

**Scenario B**: Need to call separate shipping API
- CJ provides `/logistic/freightCalculate` endpoint
- ✅ Call with: PID, quantity=1, country="US"
- ✅ Returns: US shipping fee
- Implementation: Extra API call required

**Scenario C**: Only product price available
- ❌ No shipping info in product list
- ❌ No shipping calculation endpoint available
- ⚠️ Fallback: Manual entry or weight-based estimate

## Step 2: Test Shipping Calculation API

If Scenario B (separate API needed), test this:

```http
POST /api2.0/v1/logistic/freightCalculate
Headers: {
  "CJ-Access-Token": "..."
}
Body: {
  "products": [{
    "pid": "CJYD3046124VM55",
    "quantity": 1
  }],
  "country": "US",
  "logisticName": "CJ Packet" // or null for default
}
```

Expected response:
```json
{
  "code": 200,
  "result": true,
  "data": {
    "freightFee": 8.28,
    "logisticName": "CJ Packet",
    "estimatedDays": "15-25"
  }
}
```

## Step 3: Implementation Based on API Response

### If US Shipping is in Product Response (Scenario A):
```typescript
// In lib/cjService.ts
export interface CJProduct {
  pid: string;
  sellPrice: number;           // Product price
  usShippingFee?: number;      // If this field exists
  // ... other fields
}

// Simple calculation
const usDropshippingPrice = product.sellPrice + (product.usShippingFee || 0);
```

### If Need Separate API Call (Scenario B):
```typescript
// In lib/cjService.ts
export async function calculateUSShipping(pid: string): Promise<number> {
  const authResponse = await authenticateCJ();
  const accessToken = authResponse.data.accessToken;
  
  const response = await fetch(
    `${CJ_API_BASE_URL}/logistic/freightCalculate`,
    {
      method: 'POST',
      headers: {
        'CJ-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        products: [{ pid, quantity: 1 }],
        country: 'US',
      }),
    }
  );
  
  const result = await response.json();
  return result.data.freightFee;
}

export async function getCJProductUSPrice(pid: string) {
  // Get product details
  const productResponse = await getCJProductDetails(pid);
  const product = productResponse.data;
  
  // Get US shipping
  const usShipping = await calculateUSShipping(pid);
  
  return {
    productPrice: product.sellPrice,
    usShippingFee: usShipping,
    usDropshippingPrice: product.sellPrice + usShipping,
  };
}
```

## Step 4: Update Admin UI

### Current Flow:
```
1. Admin searches for product
2. Admin clicks "Import"
3. Modal shows: supplier_price = $1.76 (WRONG!)
4. Admin sets profit: $5
5. Selling price = $6.76 (WRONG! Will lose money)
```

### New Flow:
```
1. Admin searches for product
2. Admin clicks "Import"
3. System fetches US shipping: $8.28
4. Modal shows pricing breakdown:
   Product Price:        $1.76
   US Shipping:         +$8.28
   ──────────────────────────
   US Dropship Cost:    $10.04  ← supplier_price
   
   Your Profit:         +$5.00
   ──────────────────────────
   Selling Price:       $15.04
   
5. Admin verifies and saves
6. supplier_price = $10.04 saved to database
```

### UI Changes in `/app/admin/cj-products/page.tsx`:

```tsx
// When "Import" button clicked:
const handleImportClick = async (product: CJProduct) => {
  setLoading(true);
  
  // Fetch US shipping and calculate total
  const usPricing = await fetchUSPricing(product.pid);
  
  setImportForm({
    ...
    product_price: usPricing.productPrice,      // $1.76 (display only)
    us_shipping_fee: usPricing.usShippingFee,   // $8.28 (display only)
    supplier_price: usPricing.usDropshippingPrice, // $10.04 (used for calc)
    profit_amount: 0,
    selling_price: usPricing.usDropshippingPrice,
    ...
  });
  
  setShowImportModal(true);
  setLoading(false);
};
```

## Step 5: Testing Checklist

- [ ] Fetch a product from CJ
- [ ] Verify US shipping fee is fetched correctly
- [ ] Verify US dropshipping price = product + US shipping
- [ ] Verify supplier_price uses the correct total
- [ ] Verify profit calculation: selling_price = supplier_price + profit
- [ ] Import product and check database
- [ ] Verify no hardcoded shipping values

## Step 6: Edge Cases to Handle

1. **Free Shipping Products**:
   - US shipping = $0
   - supplier_price = product_price + $0
   - ✅ Still correct

2. **Heavy Products**:
   - US shipping might be $50+
   - ✅ Admin sees actual cost before importing
   - ✅ Can set appropriate profit

3. **API Errors**:
   - If US shipping fetch fails
   - ⚠️ Show error, don't allow import
   - Or: Allow manual entry with warning

4. **Multiple Variants**:
   - Different weights = different shipping
   - ✅ Calculate US shipping per variant
   - Or: Use heaviest variant for conservative estimate

## Next Actions

1. ✅ **[DO THIS FIRST]** Go to `/admin/cj-fetch-test` and copy the JSON response
2. ✅ Identify what fields are available
3. ✅ Test if shipping calculation API exists
4. ⏳ Implement based on findings
5. ⏳ Update admin UI with pricing breakdown
6. ⏳ Test with real products
7. ⏳ Deploy to production

---

**STOP HERE**: We need the actual CJ API response before proceeding with implementation!

Please run the CJ fetch test and share the response, or let me know if you want me to proceed based on CJ's standard API documentation.
