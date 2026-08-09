# 🔑 How to Get Your CJDropshipping API Key

## Important Discovery
CJ API does NOT use email for authentication. It requires an **API Key** that you must generate from your CJ dashboard.

## Step-by-Step Guide to Get API Key

### Step 1: Install the API App
1. Log in to your CJDropshipping account at https://cjdropshipping.com
2. In the left navigation, click on **Apps**
3. Click **Install App** to open the App Store
4. Find **API** under the "Others" category
5. Click to **Install** the API app
6. You'll see "Installed Successfully" message

### Step 2: Generate Your API Key
1. Go to: https://cjdropshipping.com/personal_center.html#/apiList
2. Click the **Add API** button
3. In the dialog that appears:
   - **API Key Name**: Enter any name (e.g., "MarketNest API")
   - **Type**: Select **"API Key"** from the dropdown
   - Click **Confirm**

### Step 3: Copy Your API Key
1. In the API list, find the row where **Type** is "API Key"
2. Look for the **API Key & MCP Token** column
3. Click the **Copy icon** (📋) to copy your full API Key
4. The API Key format looks like: `CJ5366105@api@465930408b5e4ce6a5802e538fbf01a7`

## Update Your Environment Variables

### Local (.env.local)
Update your `.env.local` file:

```env
CJ_API_KEY=YOUR_CJ_API_KEY_HERE
```

Replace with YOUR actual API Key from Step 3.

### Vercel
1. Go to https://vercel.com
2. Open your MarketNest project
3. Go to **Settings** → **Environment Variables**
4. Find `CJ_API_KEY`
5. Click **Edit**
6. Paste your full API Key (format: `CJ{userId}@api@{token}`)
7. Click **Save**
8. Redeploy your application

## API Key Format
The CJ API Key has this format:
```
CJ{userId}@api@{token}
```

Example:
```
CJ5366105@api@465930408b5e4ce6a5802e538fbf01a7
```

**Do NOT use just your email** - that won't work!

## Testing After Setup

1. Update your local `.env.local` with the API Key
2. Restart your development server: `npm run dev`
3. Go to: http://localhost:3000/admin/cj-test
4. Click "Test CJ API Connection"
5. You should see ✅ "CJ API Connected Successfully"

Then for Vercel:
1. Update environment variable
2. Wait for redeploy
3. Test at: https://your-site.vercel.app/admin/cj-test

## Visual Guide to Find API Key

```
CJ Dashboard
└── Apps (left sidebar)
    └── Install App
        └── App Store
            └── Others Category
                └── API (install if not already installed)

Then:

Personal Center (top-right profile icon)
└── API Tab
    └── Add API Button
        ├── API Key Name: "MarketNest API"
        ├── Type: "API Key"
        └── Confirm
            └── Copy the generated API Key
```

## Important Notes

- ✅ API Key is required (not email)
- ✅ API Key format: `CJ{userId}@api@{token}`
- ✅ Access token expires in 15 days (auto-refreshed)
- ✅ Refresh token expires in 180 days
- ❌ Email alone will NOT work
- ❌ Email:password format will NOT work

## Troubleshooting

**Q: Where do I find the Personal Center?**
A: Click your profile icon in the top-right corner of CJ dashboard.

**Q: I don't see the API app in Apps**
A: Make sure you're logged into CJDropshipping.com, not a different CJ service.

**Q: Can I use the email and password I used to register?**
A: No, CJ API authentication requires an API Key, not account credentials.

**Q: What if I already created an API Key before?**
A: Go to the API list and copy your existing API Key. No need to create a new one.

## Next Steps
Once you have your API Key:
1. ✅ Update `.env.local`
2. ✅ Restart local server
3. ✅ Test locally at `/admin/cj-test`
4. ✅ Update Vercel environment variable
5. ✅ Wait for Vercel redeploy
6. ✅ Test on production at `/admin/cj-test`
7. ✅ Start importing products at `/admin/cj-products`
