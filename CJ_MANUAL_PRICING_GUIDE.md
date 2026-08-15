# 📋 CJ Manual Pricing Workaround Guide

**Date:** August 13, 2026  
**Status:** Manual adjustment method - SAFE and WORKING  
**Decision:** Using manual pricing adjustment instead of API fix

---

## ✅ WHY MANUAL IS FINE

The manual workaround **will NOT cause any problems**. Here's why:

1. **Customer pays correct amount** ✅
2. **You send CJ correct amount** ✅
3. **Your profit is accurate** ✅
4. **Orders process normally** ✅

The only downside is:
- Database shows wrong `supplier_price` ($8.86 instead of $10.04)
- You need to manually add adjustment to profit field
- Takes 1-2 extra minutes per product import

But it's **100% safe and functional** for running your business!

---

## 🎯 QUICK FORMULA

```
Step 1: Check CJ website for real total
Step 2: Compare with import modal supplier price
Step 3: Add the difference to profit field

Example:
CJ Website Total: $10.04
Import Shows: $8.86
Difference: $1.18

Your desired profit: $5.00
Enter in Profit Field: $1.18 + $5.00 = $6.18

Result:
- Selling Price: $15.04 ✅
- Customer pays: $15.04
- You send CJ: $10.04 (real cost)
- Your actual profit: $5.00
```

---

## 📖 STEP-BY-STEP GUIDE

### Step 1: Import Product
1. Go to `/admin/cj-products`
2. Search for product (e.g., `CJJJJTJT00130`)
3. Click "Import to Store"
4. Import modal opens

### Step 2: Note the Estimated Price
Look at the import modal:
- **Product Price:** $1.76 ✅ (This is correct)
- **US Shipping Fee:** $7.10 ⚠️ (This is ESTIMATED - wrong)
- **Supplier Price:** $8.86 ⚠️ (This is WRONG - too low)

### Step 3: Check Real Price on CJ Website
1. Open CJ product page: https://www.cjdropshipping.com/product/...
2. Find the product price: $1.76
3. Find the US shipping: $8.28 (NOT $7.10!)
4. Calculate real total: $1.76 + $8.28 = **$10.04**

### Step 4: Calculate the Adjustment
```
Real CJ Total: $10.04
Import Shows: $8.86
Missing Amount: $10.04 - $8.86 = $1.18
```

### Step 5: Set Profit Field
In the import modal "Your Profit Amount" field:

**If you want $5 profit:**
- Enter: $1.18 + $5.00 = **$6.18**

**If you want $10 profit:**
- Enter: $1.18 + $10.00 = **$11.18**

**If you want to break even (no profit):**
- Enter: **$1.18** (just the adjustment)

### Step 6: Verify Selling Price
The "Customer Selling Price" should now show:
- $8.86 + $6.18 = **$15.04** ✅

This is correct!

### Step 7: Import Product
Click "💾 Import to Store"

---

## 💰 UNDERSTANDING THE NUMBERS

### What Gets Saved in Database:
```json
{
  "supplier_price": 8.86,     // ⚠️ Wrong (estimated)
  "profit_amount": 6.18,      // Includes $1.18 adjustment
  "selling_price": 15.04      // ✅ Correct
}
```

### What Happens When Customer Orders:
1. Customer pays: **$15.04** ✅
2. You check CJ website: Total is **$10.04** ✅
3. You pay CJ: **$10.04** ✅
4. Your actual profit: $15.04 - $10.04 = **$5.00** ✅

**Everything works correctly!**

---

## 🧮 COMMON SCENARIOS

### Scenario 1: Small Product (Light Weight)
```
CJ Product: $2.50
CJ US Shipping: $6.00
Real Total: $8.50

Import Shows: $7.85 (estimated $5.35 shipping)
Missing: $0.65

Your profit: $4.00
Profit Field: $0.65 + $4.00 = $4.65
Selling Price: $13.15
```

### Scenario 2: Heavy Product
```
CJ Product: $15.00
CJ US Shipping: $12.50
Real Total: $27.50

Import Shows: $24.75 (estimated $9.75 shipping)
Missing: $2.75

Your profit: $10.00
Profit Field: $2.75 + $10.00 = $12.75
Selling Price: $40.25
```

### Scenario 3: Free Shipping
```
CJ Product: $5.00
CJ US Shipping: $0.00 (FREE)
Real Total: $5.00

Import Shows: $5.00 ✅ (correct!)
Missing: $0.00

Your profit: $3.00
Profit Field: $3.00 (no adjustment needed)
Selling Price: $8.00
```

---

## ⚠️ IMPORTANT NOTES

### Always Check CJ Website
- Import estimate is NOT accurate
- Always verify real price on CJ website before importing
- Check BOTH product price AND shipping fee

### Different Products = Different Adjustments
- Light products: smaller adjustment (e.g., $0.50)
- Heavy products: larger adjustment (e.g., $3.00)
- Each product needs individual verification

### Keep Track of Real Costs
When customer orders, use CJ website price ($10.04), NOT database price ($8.86)

### Profit Reports Will Show Wrong Numbers
- Database `profit_amount` includes adjustment
- Your ACTUAL profit = selling_price - (real CJ total)
- Don't rely on database profit field for analytics

---

## 🎯 QUICK CHECKLIST

Before importing each product:

- [ ] Product found in CJ import page
- [ ] Click "Import to Store"
- [ ] Note import modal "Supplier Price" (e.g., $8.86)
- [ ] Open CJ website for same product
- [ ] Check product price on CJ (e.g., $1.76)
- [ ] Check US shipping on CJ (e.g., $8.28)
- [ ] Calculate real total (e.g., $10.04)
- [ ] Calculate adjustment (e.g., $10.04 - $8.86 = $1.18)
- [ ] Add adjustment to your desired profit (e.g., $1.18 + $5 = $6.18)
- [ ] Enter in "Your Profit Amount" field
- [ ] Verify "Selling Price" looks correct
- [ ] Click "Import to Store"

---

## 📊 EXAMPLE CALCULATION SHEET

| Product PID | Import Shows | CJ Real | Adjustment | Your Profit | Enter in Field | Selling Price |
|-------------|--------------|---------|------------|-------------|----------------|---------------|
| CJJJJTJT00130 | $8.86 | $10.04 | $1.18 | $5.00 | $6.18 | $15.04 |
| CJYD1234567 | $12.50 | $14.75 | $2.25 | $7.00 | $9.25 | $24.00 |
| CJAB9876543 | $6.30 | $7.00 | $0.70 | $3.50 | $4.20 | $10.50 |

---

## ✅ CONFIRMATION THIS WORKS

### Customer Checkout Flow:
1. Customer sees product: $15.04
2. Customer adds to cart
3. Customer goes to checkout: Total $15.04
4. Customer pays: $15.04 ✅
5. Order created in database

### Your Fulfillment Flow:
1. You receive order notification
2. You check product: CJJJJTJT00130
3. You go to CJ website
4. You place order: $10.04 ✅
5. CJ ships to customer
6. Your profit: $15.04 - $10.04 = $5.00 ✅

**Everything works perfectly!**

---

## 🆘 TROUBLESHOOTING

### "I forgot to add adjustment!"
- Product will be underpriced
- Edit product in admin panel
- Update selling price manually
- Or delete and re-import correctly

### "I'm not sure what CJ real price is"
- Always check CJ website
- Look for "Total" or "Dropshipping Price"
- Must include product + shipping to US

### "Different variants have different shipping"
- Check the specific variant on CJ
- Use that variant's shipping fee
- Each variant may need different adjustment

---

## 💡 PRO TIPS

1. **Open CJ website in another tab** before importing - makes checking easier

2. **Create a spreadsheet** to track:
   - Product PID
   - Real CJ cost
   - Import estimated cost
   - Adjustment amount
   - Final selling price

3. **Start with 5-10 products** - Get comfortable with the process

4. **Double-check first 3 imports** - Verify prices on CJ website after importing

5. **Use consistent profit margin** - Makes calculations easier (e.g., always $5 profit)

---

## 📝 SUMMARY

**Manual workaround is:**
- ✅ Safe and reliable
- ✅ Will NOT break anything
- ✅ Customers pay correct amount
- ✅ You pay CJ correct amount
- ✅ Your profit is correct
- ⚠️ Just takes 1-2 extra minutes per product

**The only downside:**
- Database shows wrong `supplier_price`
- Profit field includes adjustment (confusing for reports)

**Bottom line:**
- Perfect for small stores (< 100 products)
- Gets you selling TODAY
- Can automate later if needed

---

**Status:** Manual workaround documented and approved ✅

You're good to go! Import your products and start selling! 🚀
