# 🔧 TELEGRAM NOTIFICATION TROUBLESHOOTING

## Issue: Not Receiving Telegram Notifications

---

## 📋 IMMEDIATE CHECKS

### Step 1: Verify Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your **Marketnest** project
3. Click **Settings** → **Environment Variables**
4. Verify these TWO variables exist:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

**Important:**
- Variable names must be EXACTLY as shown (case-sensitive)
- No extra spaces before or after values
- Applied to "Production" environment

### Step 2: Check Your Bot on Telegram

1. Open Telegram app on your phone
2. Search for your bot (the one you created)
3. Open the chat
4. **Send `/start` command** (type it and send)
5. You should see some response (even if just "OK")

**Without sending `/start`, bot CANNOT send you messages!**

### Step 3: Verify Deployment

1. Go to Vercel Dashboard
2. Click **Deployments** tab
3. Check if latest deployment is **"Ready"** (not "Building" or "Error")
4. The deployment time should be AFTER you updated environment variables

**If deployment was before updating env vars → You need to redeploy!**

---

## 🧪 USE THE TEST PAGE

I created a test page for you:

**URL:** `https://your-site.vercel.app/admin/test-telegram`

Or locally: `http://localhost:3000/admin/test-telegram`

This will:
- ✅ Send a test notification
- ✅ Show you the exact error if it fails
- ✅ Help diagnose the problem

---

## 🔍 DETAILED DIAGNOSTICS

### Diagnostic 1: Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to **Deployments** tab
4. Click on the latest deployment
5. Click **Functions** tab
6. Look for `/api/telegram-notification`
7. Click on it to see logs

**Look for these messages:**

✅ **"Telegram notification sent successfully!"**
- Means it's working! Check your Telegram app.

⚠️ **"Telegram not configured - skipping notification"**
- Environment variables are missing or not loaded
- Solution: Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to Vercel
- Then redeploy

❌ **"Unauthorized" or "401"**
- Wrong bot token
- Solution: Get token from @BotFather and update Vercel

❌ **"Bad Request: chat not found"**
- Wrong chat ID OR you haven't started the bot
- Solution: Send /start to your bot on Telegram

❌ **"Bad Request: can't parse message text"**
- Message formatting issue (unlikely)
- The message might have special characters causing problems

### Diagnostic 2: Manual Bot Test

Test your bot manually using curl:

```bash
# Replace YOUR_BOT_TOKEN with your actual token
# Replace YOUR_CHAT_ID with your actual chat ID

curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "YOUR_CHAT_ID",
    "text": "Test from MarketNest - if you see this, your bot works!"
  }'
```

**Expected Response:**
```json
{
  "ok": true,
  "result": {
    "message_id": 123,
    ...
  }
}
```

**If you get an error:**
- "Unauthorized" = Wrong bot token
- "Chat not found" = Wrong chat ID or bot not started
- "Bad Request" = Check token/chat ID format

---

## 🔧 COMMON ISSUES & SOLUTIONS

### Issue 1: "Variables not found in Vercel"

**Symptom:** Logs show "Telegram not configured"

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Click **Add New**
3. Name: `TELEGRAM_BOT_TOKEN`
4. Value: Your token from @BotFather
5. Environment: **Production** ✅
6. Click **Save**
7. Repeat for `TELEGRAM_CHAT_ID`
8. **Redeploy your app** (very important!)

### Issue 2: "Bot token is wrong/expired"

**Symptom:** Error 401 or "Unauthorized"

**Solution:**
1. The old token was revoked (good for security!)
2. Get NEW token from @BotFather:
   - Open Telegram → @BotFather
   - Send: `/mybots`
   - Select your bot
   - Click "API Token"
   - Copy the token
3. Update in Vercel environment variables
4. Redeploy

### Issue 3: "Chat not found"

**Symptom:** Error "Bad Request: chat not found"

**Solution:**
1. You haven't started the bot yet
2. On Telegram:
   - Search for your bot
   - Open chat
   - Click **START** button
   - OR send `/start` command
3. Try again

### Issue 4: "Wrong Chat ID"

**Symptom:** Error "Bad Request: chat_id is invalid"

**Solution:**
1. Get your correct chat ID:
   - Open Telegram
   - Search: @userinfobot
   - Send any message
   - Bot replies with your ID (e.g., "8325905031")
2. Update in Vercel: `TELEGRAM_CHAT_ID` = `8325905031`
3. Redeploy

### Issue 5: "Environment variables not loading"

**Symptom:** Works locally but not on Vercel

**Solution:**
1. Environment variables are separate for production
2. Must add them to Vercel, not just .env.local
3. After adding, MUST redeploy
4. Check deployment status - should be "Ready"

### Issue 6: "Old deployment is running"

**Symptom:** Updated env vars but still failing

**Solution:**
1. Vercel doesn't auto-redeploy when env vars change
2. Manual redeploy needed:
   - Go to Vercel Deployments
   - Find latest deployment
   - Click "..." menu
   - Click "Redeploy"
3. Wait for "Ready" status
4. Try again

---

## ✅ VERIFICATION CHECKLIST

Go through this checklist:

- [ ] ✅ Bot created with @BotFather
- [ ] ✅ Bot token copied (looks like: `1234567890:ABCdefGHI...`)
- [ ] ✅ Chat ID obtained from @userinfobot (looks like: `8325905031`)
- [ ] ✅ Sent `/start` to bot on Telegram
- [ ] ✅ Added `TELEGRAM_BOT_TOKEN` to Vercel env vars
- [ ] ✅ Added `TELEGRAM_CHAT_ID` to Vercel env vars
- [ ] ✅ Both applied to "Production" environment
- [ ] ✅ Redeployed app after adding env vars
- [ ] ✅ Deployment status is "Ready"
- [ ] ✅ Tested using `/admin/test-telegram` page
- [ ] ✅ Checked Vercel function logs for errors

---

## 🎯 STEP-BY-STEP FIX

If still not working, follow these steps EXACTLY:

### 1. Get Fresh Credentials (5 minutes)

**Get Bot Token:**
```
1. Open Telegram
2. Search: @BotFather
3. Send: /mybots
4. Select your bot
5. Tap: API Token
6. Copy the entire token
```

**Get Chat ID:**
```
1. Open Telegram
2. Search: @userinfobot
3. Send any message (e.g., "hi")
4. Bot replies with: "Id: 8325905031"
5. Copy just the number
```

**Start the Bot:**
```
1. Open Telegram
2. Search for your bot name
3. Open the chat
4. Tap START button (or send /start)
```

### 2. Update Vercel (3 minutes)

```
1. Go to: https://vercel.com/dashboard
2. Click your Marketnest project
3. Click: Settings
4. Click: Environment Variables
5. Delete old TELEGRAM_BOT_TOKEN (if exists)
6. Delete old TELEGRAM_CHAT_ID (if exists)
7. Click: Add New
8. Name: TELEGRAM_BOT_TOKEN
9. Value: [paste token from step 1]
10. Environment: Production ✅
11. Click: Save
12. Click: Add New
13. Name: TELEGRAM_CHAT_ID
14. Value: [paste ID from step 1]
15. Environment: Production ✅
16. Click: Save
```

### 3. Redeploy (2 minutes)

```
1. Stay in Vercel Dashboard
2. Click: Deployments tab
3. Click on latest deployment
4. Click: ... (three dots menu)
5. Click: Redeploy
6. Wait for "Ready" status (1-2 minutes)
```

### 4. Test (1 minute)

```
1. Go to: your-site.vercel.app/admin/test-telegram
2. Click: "Send Test Notification"
3. Check your Telegram app
4. You should see the test notification!
```

---

## 📱 EXPECTED RESULT

After following all steps, when you place an order or use the test page, you should see this on Telegram:

```
🎉 NEW ORDER RECEIVED!

👤 Customer Details:
Name: Test Customer
Email: test@example.com
Phone: +1234567890

📦 Order Summary:
Total Amount: $99.99 USD
Number of Items: 1

🚚 Delivery Address:
123 Test Street
Test City, Test State
Test Country
Postal Code: 12345

📝 Order Notes:
This is a test notification

---
💻 View in admin dashboard:
https://marketnest-shop-one.vercel.app/admin/orders

⏰ [Current date and time]
```

---

## 🆘 STILL NOT WORKING?

If you've tried EVERYTHING and it still doesn't work:

1. **Screenshot the error** from Vercel function logs
2. **Screenshot Vercel environment variables** page (blur the actual values)
3. **Screenshot the test page result**
4. **Confirm you sent `/start` to the bot**

Common final issues:
- Bot was banned by Telegram (create new bot)
- Telegram servers are down (very rare)
- ISP blocking Telegram API (try different network)
- Account restrictions (verify Telegram account is active)

---

## ✅ MARK AS READ BUTTON FIX

The "mark as read" button issue is separate. Run this SQL:

```sql
-- Run this in Supabase SQL Editor
-- File: FIX_NOTIFICATIONS_AND_TELEGRAM.sql

-- Drop and recreate RLS policies
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

CREATE POLICY "Users can update own notifications" 
ON notifications FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

Then test the mark as read button again.

---

## 📝 SUMMARY

**For Telegram notifications:**
1. Ensure both env vars are in Vercel
2. Redeploy after adding env vars
3. Send /start to bot
4. Test using `/admin/test-telegram`

**For mark as read:**
1. Run the SQL script: `FIX_NOTIFICATIONS_AND_TELEGRAM.sql`
2. This fixes RLS policies

Both should work after these fixes! 🎉
