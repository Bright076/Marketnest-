# CJ API Response Inspection Required

## Goal
Before implementing the pricing fix, we need to inspect the ACTUAL fields returned by the CJ API to identify:

1. Product/unit price field name
2. Shipping fee field name (if available)
3. Total dropshipping price field name (if available)
4. Destination/shipping method fields

## How to Inspect

### Option 1: Use the CJ Fetch Test Page (RECOMMENDED)
1. Go to: `/admin/cj-fetch-test`
2. Click "📦 Fetch 10 Products from CJ"
3. Scroll down to "🔍 Raw API Response (for debugging)"
4. Look for these fields in the response:
   - `sellPrice` or `price` - Product price
   - `freightFee`, `shippingFee`, or `logisticFee` - Shipping cost
   - `totalPrice`, `dropshippingPrice` - Total cost
   - `productWeight` - Needed for shipping calculation
   - Any shipping-related fields

### Option 2: Check Product List API Response
The response from `/api2.0/v1/product/list` typically returns:

```json
{
  "code": 200,
  "result": true,
  "message": "success",
  "data": {
    "list": [
      {
        "pid": "CJYD3046124VM55",
        "productName": "Product Name",
        "productNameEn": "Product Name English",
        "productSku": "CJYD3046124",
        "productImage": "https://...",
        "sell Price": X.XX,           ← Product price only?
        "productWeight": X.XX,        ← Weight in kg/lbs
        "categoryName": "Category",
        "stock": 100,
        // LOOK FOR THESE:
        "freightFee": ?,              ← Shipping fee?
        "totalPrice": ?,              ← Total dropshipping price?
        "variants": []                ← May have variant-specific pricing
      }
    ],
    "total": 1000,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

### Option 3: Check Product Query API
Try querying a specific product:

```
POST /api2.0/v1/product/query
Body: { "pid": "CJYD3046124VM55" }
```

This might return more detailed information including shipping costs.

## What to Look For

### Scenario 1: Total Price is Available
If the API returns a field like:
- `totalPrice`
- `dropshippingPrice`
- `fulfillmentPrice`

Then we can use that directly as `supplier_price`.

### Scenario 2: Separate Product + Shipping Fields
If the API returns:
- `sellPrice` = product price
- `freightFee` or `shippingFee` = shipping cost

Then we calculate:
```
supplier_price = sellPrice + freightFee
```

### Scenario 3: Only Product Price Available
If only `sellPrice` is available, we need to:
1. Use the shipping calculation API (`/logistic/freightCalculate`)
2. Or apply a conservative shipping estimate based on weight
3. Or require manual shipping cost entry in admin UI

## CJ API Documentation References

According to CJ Dropshipping API docs:

### Product List Endpoint
- **Endpoint**: `GET /api2.0/v1/product/list`
- **Purpose**: Search/list products
- **Returns**: Basic product info including `sellPrice`

### Product Query Endpoint
- **Endpoint**: `POST /api2.0/v1/product/query`
- **Purpose**: Get detailed product information
- **Returns**: Full product details, may include shipping info

### Freight Calculate Endpoint (if available)
- **Endpoint**: `POST /api2.0/v1/logistic/freightCalculate`
- **Purpose**: Calculate shipping cost
- **Requires**: Product PID, quantity, destination country
- **Returns**: Shipping cost for specified parameters

## Action Items

1. **FIRST**: Run the CJ Fetch Test (`/admin/cj-fetch-test`)
2. **Copy** the entire raw API response
3. **Identify** all pricing-related fields
4. **Document** what fields are available
5. **Then** implement the correct pricing logic based on available fields

## Expected Outcome

After inspection, we should know:
- ✅ What field contains product price
- ✅ What field contains shipping fee (if any)
- ✅ What field contains total dropshipping price (if any)
- ✅ Whether we need to call additional APIs for shipping
- ✅ What the correct implementation approach should be

---

**STOP**: Do not proceed with implementation until we inspect the actual API response!
