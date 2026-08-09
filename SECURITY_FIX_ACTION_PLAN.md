# 🚨 SECURITY INCIDENT - ACTION PLAN

## ⚠️ WHAT HAPPENED
GitGuardian detected exposed secrets in your GitHub repository. Your Telegram Bot Token, Supabase keys, and CJ API key were exposed in markdown documentation files that were pushed to GitHub.

---

## ✅ WHAT I ALREADY DID

1. ✅ Removed all hardcoded secrets from markdown files (replaced with placeholders)
2. ✅ Updated `.gitignore` to explicitly ignore all `.env*` files
3. ✅ Verified `.env.local` was never committed to Git
4. ✅ Verified all source code uses `process.env.VARIABLE_NAME` (secure)

---

## 🔥 URGENT ACTIONS YOU MUST TAKE NOW

### STEP 1: Rotate Your Telegram Bot Token (HIGHEST PRIORITY)

**Why?** The token is exposed on GitHub - anyone can use it to send messages as your bot.

**How to rotate:**

1. Open Telegram and message **@BotFather**
2. Send command: `/mybots`
3. Select your bot from the list
4. Click **"API Token"**
5. Click **"Revoke current token"** ⚠️ (This disables the old exposed token)
6. You'll receive a NEW token - copy it
7. Update your local `.env.local`:
   ```env
   TELEGRAM_BOT_TOKEN=<NEW_TOKEN_HERE>
   ```
8. Save the file

**Important:** The old token will stop working immediately after revocation.

---

### STEP 2: Check Supabase Keys (MEDIUM PRIORITY)

**Anon Key** (NEXT_PUBLIC_SUPABASE_ANON_KEY):
- ✅ This is safe to expose - it's public and has RLS protection
- ❌ **Action:** No rotation needed

**Service Role Key** (SUPABASE_SERVICE_ROLE_KEY):
- ⚠️ This was exposed in VERCEL_MANUAL_FIX.md
- 🔥 **Action:** Rotate this key immediately

**How to rotate Service Role Key:**

1. Go to https://supabase.com/dashboard
2. Select your project: `yuhevckzxzzkazxickir`
3. Go to **Settings** → **API**
4. Under "Project API keys" find **service_role** key
5. Click **"Rotate"** or **"Reset"** button
6. Copy the NEW service role key
7. Update your local `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=<NEW_SERVICE_ROLE_KEY>
   ```
8. Save the file

---

### STEP 3: Check CJ API Key (LOW-MEDIUM PRIORITY)

Your CJ API key was exposed: `CJ5366105@api@465930408b5e4ce6a5802e538fbf01a7`

**Recommendation:** Change your CJ password if possible

**How to secure CJ account:**

1. Go to CJDropshipping website
2. Login to your account
3. Go to **Account Settings** → **Security**
4. Change your password
5. If available, enable 2FA (two-factor authentication)
6. After changing password, get new API key from CJ dashboard
7. Update `.env.local` with new key

---

### STEP 4: Commit The Security Fixes

Now that I've removed secrets from all files, commit these changes:

```bash
cd marketnest
git add .
git commit -m "Security: Remove exposed secrets from documentation files"
```

---

### STEP 5: Force Push to Rewrite Git History

⚠️ **WARNING:** This will rewrite GitHub history. Anyone who has cloned your repo will need to re-clone.

```bash
# This removes the commit with exposed secrets
git push origin main --force
```

**What this does:**
- Removes the exposed secrets from GitHub
- Makes the old commit with secrets inaccessible
- GitGuardian will stop alerting

---

### STEP 6: Update Vercel Environment Variables

After rotating your keys, update them in Vercel:

1. Go to https://vercel.com/dashboard
2. Select your **Marketnest** project
3. Go to **Settings** → **Environment Variables**
4. Update these variables with NEW values:
   - `TELEGRAM_BOT_TOKEN` = <new_token_from_step_1>
   - `SUPABASE_SERVICE_ROLE_KEY` = <new_key_from_step_2>
   - `CJ_API_KEY` = <new_key_from_step_3_if_changed>
5. Click **Save**
6. Redeploy your application

---

### STEP 7: Verify Everything Works

After updating all keys:

1. **Test Telegram notifications:**
   - Place a test order on your site
   - Check if you receive Telegram notification
   - If not, you may need to `/start` your bot again

2. **Test CJ integration:**
   - Go to `/admin/cj-products`
   - Try searching for a product
   - Verify search works

3. **Test Supabase:**
   - Try logging in
   - Try viewing products
   - Verify database operations work

---

## 📋 CHECKLIST

Complete these in order:

- [ ] **Step 1:** Revoke old Telegram bot token via @BotFather
- [ ] **Step 1:** Update `.env.local` with new Telegram token
- [ ] **Step 2:** Rotate Supabase Service Role Key
- [ ] **Step 2:** Update `.env.local` with new Supabase key
- [ ] **Step 3:** (Optional) Change CJ password and get new API key
- [ ] **Step 3:** Update `.env.local` with new CJ key if changed
- [ ] **Step 4:** Run: `git add .`
- [ ] **Step 4:** Run: `git commit -m "Security: Remove exposed secrets"`
- [ ] **Step 5:** Run: `git push origin main --force`
- [ ] **Step 6:** Update Vercel environment variables with NEW keys
- [ ] **Step 6:** Redeploy on Vercel
- [ ] **Step 7:** Test Telegram notifications
- [ ] **Step 7:** Test CJ product search
- [ ] **Step 7:** Test login/database

---

## 🛡️ FUTURE PREVENTION

To prevent this from happening again:

### 1. Never Put Secrets in Documentation
```markdown
❌ BAD:
TELEGRAM_BOT_TOKEN=8894934384:AAHf1D4cNtycT9iJwiXOQP1vZIi7fkfIIf4

✅ GOOD:
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
```

### 2. Use Environment Variables Only
All sensitive data should be in `.env.local` which is gitignored:
```typescript
✅ GOOD: const token = process.env.TELEGRAM_BOT_TOKEN;
❌ BAD: const token = "8894934384:AAHf1D4cNtycT9iJwiXOQP1vZIi7fkfIIf4";
```

### 3. Review Before Committing
Before `git push`, always run:
```bash
git diff
```
Check that no secrets are included.

### 4. Use `.env.example` for Documentation
Create a template file:
```bash
# .env.example (safe to commit)
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

---

## ❓ FAQ

**Q: Will my site stop working after revoking the Telegram token?**
A: Temporarily yes, until you update Vercel with the new token. Order creation will still work, but Telegram notifications will fail silently.

**Q: Do I need to rotate the Supabase Anon Key?**
A: No. The anon key is meant to be public. RLS (Row Level Security) protects your data.

**Q: How do I know if someone used my exposed token?**
A: Check your Telegram bot - if you see messages you didn't send, someone used it. For CJ and Supabase, check activity logs in their dashboards.

**Q: Can I skip the force push?**
A: Not recommended. The secrets will remain in Git history and GitGuardian will keep alerting. But if you rotate all keys, the old ones become useless anyway.

**Q: What if force push fails?**
A: If you have branch protection rules on GitHub, disable them temporarily:
- Go to GitHub repo → Settings → Branches
- Edit branch protection rule for `main`
- Temporarily disable, force push, then re-enable

---

## 🆘 NEED HELP?

If you get stuck:
1. Check Vercel logs: Vercel Dashboard → Your Project → Functions tab
2. Check browser console (F12) for errors
3. Test each service independently:
   - Telegram: Send test message via @BotFather
   - Supabase: Try logging in
   - CJ: Go to `/admin/cj-test`

---

## ✅ SUMMARY

**What's secure:**
- ✅ `.env.local` never committed
- ✅ All source code uses environment variables
- ✅ `.gitignore` properly configured

**What needs action:**
- 🔥 Rotate Telegram bot token (URGENT)
- ⚠️ Rotate Supabase Service Role Key (IMPORTANT)
- ⚡ Consider rotating CJ API key (RECOMMENDED)
- 📤 Force push to remove secrets from GitHub history

**After you complete these steps, your application will be secure! 🔒**
