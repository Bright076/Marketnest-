# 🚀 Update Vercel Environment Variable

## Quick Instructions

Your code has been pushed to GitHub and Vercel will automatically redeploy. However, you need to update ONE environment variable in Vercel:

### Step 1: Go to Vercel
1. Open https://vercel.com
2. Go to your MarketNest project
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar

### Step 2: Update CJ_API_KEY
1. Find the `CJ_API_KEY` variable
2. Click the **Edit** button (pencil icon)
3. Change the value from:
   ```
   brightchidubem87@gmail.com:465930408b5e4ce6a5802e538fbf01a7
   ```
   
   To:
   ```
   brightchidubem87@gmail.com
   ```
   
4. Click **Save**

### Step 3: Redeploy (if needed)
- Vercel should automatically redeploy after you pushed the code
- If not, go to **Deployments** tab and click **Redeploy** on the latest deployment

### Step 4: Test
After deployment completes (usually 1-2 minutes):

1. **Test the connection:**
   - Go to: `https://your-site.vercel.app/admin/cj-test`
   - Click "Test CJ API Connection"
   - You should see: ✅ "CJ API Connected Successfully"

2. **Search for products:**
   - Go to: `https://your-site.vercel.app/admin/cj-products`
   - Type a product name (e.g., "phone case", "shoes", "watch")
   - Click "Search Products"
   - You should see CJ products appear

3. **Import products:**
   - Click "Import Product" on any product you want to add
   - Set your profit amount (e.g., $5, $10)
   - Click "Save to Database"
   - Product will be added to your store!

## What We Fixed
The CJ API was rejecting authentication because we were sending both email and password. CJ's authentication endpoint only needs your email address. The code now sends just your email, which is the correct way to authenticate with CJ.

## Copy-Paste Value for Vercel
```
brightchidubem87@gmail.com
```

That's it! After updating the environment variable in Vercel, everything should work.
