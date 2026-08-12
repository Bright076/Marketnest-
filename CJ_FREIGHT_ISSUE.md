# CJ Freight Calculation Issue

## Problem
When importing CJ products, seeing:
1. "Failed to fetch product details" error
2. All products showing "FREE SHIPPING to US" ($ 0.00)

## Root Cause Analysis

### Issue 1: Product Details API
The `/product/query` endpoint might:
- Require different parameters than `pid`
- Not be available in your CJ API tier
- Have rate limiting

### Issue 2: Freight Calculate API
The `/logistic/freightCalculate` endpoint:
- Returns 0 for all products (or fails silently)
- May not be available in your CJ API tier
- May require additional parameters we're not providing

## What's Happening
1. Frontend calls `/api/cj/products/us-pricing` with PID
2. Backend calls CJ `/product/query` → FAILS
3. Error: "Failed to fetch product details"

## Browser Console Check
Please check browser console (F12) and share:
1. The full error message
2. Any HTTP status codes
3. Response from `/api/cj/products/us-pricing`

## Temporary Solution
Until we debug the CJ API endpoints, we can:

**Option A**: Use weight-based shipping estimate
- Light products (<100g): $3-5
- Medium products (100-500g): $5-10
- Heavy products (>500g): $10-20

**Option B**: Manual shipping entry
- Admin manually enters US shipping when importing
- Most accurate but requires admin input

**Option C**: Fixed US shipping rate
- Add $8 to all products as base US shipping
- Simple but not accurate

## Next Steps
1. Check browser console for exact error
2. Test CJ `/product/query` endpoint separately
3. Test CJ `/logistic/freightCalculate` endpoint separately
4. Implement appropriate fallback based on findings
