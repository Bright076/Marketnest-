# 📊 Visit Tracking System - Quick Summary

## What It Does
Tracks every page visit and displays analytics in your admin dashboard.

---

## 🎯 Quick Start (3 Steps)

### 1. Run SQL in Supabase
Copy and run `DATABASE_MIGRATION_VISIT_TRACKING.sql` in Supabase SQL Editor.

### 2. Deploy Code
Push to Git - code is already integrated.

### 3. Check Dashboard
Visit Admin Dashboard → See "👥 Visitors Analytics" section.

---

## 📂 Files Created

1. **`DATABASE_MIGRATION_VISIT_TRACKING.sql`** - Creates `visits` table
2. **`app/components/VisitTracker.tsx`** - Auto-tracks page views
3. **`app/api/track-visit/route.ts`** - Saves visits to database
4. **`app/api/visit-stats/route.ts`** - Returns analytics
5. **`VISIT_TRACKING_SETUP.md`** - Full documentation

## 📂 Files Modified

1. **`app/layout.tsx`** - Added VisitTracker component
2. **`app/admin/page.tsx`** - Added analytics dashboard

---

## 📊 Dashboard Shows

- **Total Visits** - All-time count
- **Today's Visits** - Current day count
- **7-Day Chart** - Visual bar chart with daily breakdown

---

## ⚙️ How It Works

1. User visits any page
2. `VisitTracker` component automatically fires
3. Sends POST request to `/api/track-visit`
4. Saves page path + timestamp to database
5. Admin dashboard fetches stats from `/api/visit-stats`
6. Displays totals and 7-day chart

---

## 🔒 Features

✅ **Lightweight** - No external analytics libraries  
✅ **Privacy-friendly** - Only tracks page paths  
✅ **Self-hosted** - Data in your Supabase  
✅ **Silent fail** - Won't break your site  
✅ **Fast** - Indexed database queries  
✅ **Configurable** - Easy to customize  

---

## 📋 Database Table

**Table:** `visits`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `page_path` | TEXT | URL path (e.g., `/`, `/cart`) |
| `visited_at` | TIMESTAMP | When visit occurred |
| `created_at` | TIMESTAMP | Record creation time |

**Indexes:**
- `idx_visits_visited_at` - Fast date queries
- `idx_visits_page_path` - Fast page queries
- `idx_visits_date` - Fast daily aggregation

---

## 🎨 Admin Dashboard Preview

```
👥 Visitors Analytics
━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────┐  ┌────────────────┐
│ 👁️  Total      │  │ 🔥  Today      │
│                │  │                │
│    1,234       │  │     87         │
│ Total Visits   │  │ Today's Visits │
└────────────────┘  └────────────────┘

📊 Last 7 Days Breakdown

 [Bar Chart]
 Mon Tue Wed Thu Fri Sat Sun
 |||  ||  |||  ||| ||| ||| |||
```

---

## 🚫 What It Doesn't Track

- ❌ User identity
- ❌ IP addresses
- ❌ Cookies
- ❌ Personal information
- ❌ Browser details (configurable)
- ❌ Cross-session data

---

## ⚡ Performance

- **Page load impact:** ~0ms (async)
- **Database writes:** 1 per page view
- **API calls:** 1 per page view
- **Dashboard load:** 1 API call for stats

**Storage estimate:**
- 1,000 visits/day = 30MB/year

---

## 🔧 Configuration

### Track Admin Pages
Edit `app/components/VisitTracker.tsx`:
```typescript
// Remove this block to track admin pages:
if (pathname?.startsWith('/admin')) {
  return;
}
```

### Track Only Specific Pages
```typescript
const trackedPaths = ['/', '/products', '/cart'];
if (!trackedPaths.includes(pathname || '')) {
  return;
}
```

---

## 🧪 Test It

1. Visit your homepage
2. Navigate to 2-3 pages
3. Go to Admin Dashboard
4. See visitor stats update!

**Database check:**
```sql
SELECT * FROM visits ORDER BY visited_at DESC LIMIT 10;
```

---

## 📈 Easy Extensions

### Most Visited Pages
Query `visits` grouped by `page_path`

### Hourly Breakdown
Group by hour of day

### Week-over-Week Growth
Compare last 7 days vs previous 7 days

### Export to CSV
Add download button in dashboard

See `VISIT_TRACKING_SETUP.md` for code examples.

---

## ✅ Deployment Checklist

- [ ] Run `DATABASE_MIGRATION_VISIT_TRACKING.sql` in Supabase
- [ ] Push code to Git (already integrated)
- [ ] Wait for Vercel deployment
- [ ] Test: Visit homepage
- [ ] Verify: Check admin dashboard
- [ ] Confirm: See visitor stats

---

## 📞 Troubleshooting

**No visits tracked?**
- Check if `visits` table exists in Supabase
- Check browser console for errors
- Verify VisitTracker is in layout.tsx

**Dashboard shows no data?**
- Visit some pages first
- Check `/api/visit-stats` endpoint works
- Verify database has records

**Need help?**
See full guide: `VISIT_TRACKING_SETUP.md`

---

**Status:** ✅ Ready to deploy after database migration

**Next:** Run SQL migration in Supabase, then push code!

