# 📊 Visit Tracking System - Setup Guide

## Overview

A lightweight, self-hosted visit tracking system that logs page visits to your Supabase database and displays analytics in your admin dashboard.

---

## ✅ What Was Implemented

### 1. Database Table
- **`visits`** table stores all page visits
- Columns: `id`, `page_path`, `visited_at`, `created_at`
- Indexes for fast queries

### 2. Tracking Component
- **`VisitTracker.tsx`** - Automatically tracks all page views
- Sends visit data to API on every page navigation
- Silent fail - doesn't disrupt user experience
- Currently excludes admin pages (configurable)

### 3. API Routes
- **`/api/track-visit`** - Logs visits to database
- **`/api/visit-stats`** - Returns analytics data

### 4. Admin Dashboard
- **Total Visits** - All-time visit count
- **Today's Visits** - Current day visits
- **7-Day Breakdown** - Visual bar chart showing daily visits

---

## 🚀 Setup Instructions

### Step 1: Run Database Migration

Open your Supabase SQL Editor and run:

```sql
-- MarketNest: Visit Tracking System
-- Run this in Supabase SQL Editor

-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_page_path ON visits(page_path);
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(DATE(visited_at));

-- Add comments
COMMENT ON TABLE visits IS 'Tracks page visits for analytics';
COMMENT ON COLUMN visits.page_path IS 'URL path that was visited';
COMMENT ON COLUMN visits.visited_at IS 'Timestamp when the visit occurred';
```

### Step 2: Deploy Code

The code is already integrated:
- ✅ VisitTracker component added to root layout
- ✅ API routes created
- ✅ Admin dashboard updated

Just push to Git and Vercel will deploy automatically.

### Step 3: Verify It's Working

1. Visit your website homepage
2. Navigate to a few pages
3. Go to Admin Dashboard
4. Scroll to "👥 Visitors Analytics" section
5. You should see visit counts!

---

## 📁 Files Created/Modified

### Created Files:
1. **`DATABASE_MIGRATION_VISIT_TRACKING.sql`** - Database setup
2. **`app/components/VisitTracker.tsx`** - Tracking component
3. **`app/api/track-visit/route.ts`** - Visit logging API
4. **`app/api/visit-stats/route.ts`** - Analytics API
5. **`VISIT_TRACKING_SETUP.md`** - This guide

### Modified Files:
1. **`app/layout.tsx`** - Added VisitTracker component
2. **`app/admin/page.tsx`** - Added Visitors Analytics section

---

## 🎨 Admin Dashboard Features

### Summary Cards
- **Total Visits** - Blue gradient card with all-time count
- **Today's Visits** - Green gradient card with today's count

### 7-Day Chart
- Visual bar chart showing visits per day
- Today highlighted in green
- Past days in blue
- Shows day name and date
- Responsive and scrollable on mobile

---

## ⚙️ Configuration Options

### Tracking Admin Pages

By default, admin pages are NOT tracked. To track them:

Edit `app/components/VisitTracker.tsx`:

```typescript
// Remove or comment out this block:
if (pathname?.startsWith('/admin')) {
  return;
}
```

### Tracking Specific Pages Only

To track only certain pages:

```typescript
// In VisitTracker.tsx, add a whitelist:
const trackedPaths = ['/', '/products', '/cart', '/checkout'];
if (!trackedPaths.includes(pathname || '')) {
  return;
}
```

### Adding User Information

To track more data (like user agent, referrer):

Edit `app/api/track-visit/route.ts`:

```typescript
const { error } = await supabase
  .from("visits")
  .insert([
    {
      page_path,
      visited_at: new Date().toISOString(),
      // Add more fields:
      user_agent: request.headers.get('user-agent'),
      referrer: request.headers.get('referer'),
    },
  ]);
```

Don't forget to add these columns to the database first!

---

## 📊 Analytics Capabilities

### Current Features:
- ✅ Total visits count
- ✅ Today's visits
- ✅ Last 7 days breakdown
- ✅ Daily visit chart

### Easy Extensions:

#### Most Visited Pages:
```typescript
// In visit-stats API route:
const { data: topPages } = await supabase
  .from("visits")
  .select("page_path")
  .order("visited_at", { ascending: false })
  .limit(10);

// Group and count
const pageCounts = topPages.reduce((acc, visit) => {
  acc[visit.page_path] = (acc[visit.page_path] || 0) + 1;
  return acc;
}, {});
```

#### Hourly Breakdown:
```typescript
// Group visits by hour
const hourlyStats = recentVisits?.reduce((acc, visit) => {
  const hour = new Date(visit.visited_at).getHours();
  acc[hour] = (acc[hour] || 0) + 1;
  return acc;
}, {});
```

#### Week-over-Week Growth:
```typescript
// Compare current week to previous week
const lastWeekStart = new Date();
lastWeekStart.setDate(lastWeekStart.getDate() - 14);

const { count: lastWeekVisits } = await supabase
  .from("visits")
  .select("*", { count: "exact", head: true })
  .gte("visited_at", lastWeekStart.toISOString())
  .lt("visited_at", sevenDaysAgo.toISOString());
```

---

## 🔒 Privacy & Performance

### Privacy Considerations:
- **No personal data** - Only page paths and timestamps
- **No cookies** - No user tracking across sessions
- **Self-hosted** - Data stays in your Supabase database
- **No third parties** - No external analytics services

### Performance:
- **Async tracking** - Doesn't block page rendering
- **Silent failures** - Won't break your site if API fails
- **Indexed queries** - Fast database lookups
- **Lightweight** - No heavy analytics libraries

### Database Growth:
With 1,000 visits/day:
- 30,000 visits/month
- 360,000 visits/year
- ~50MB database space/year (approx)

To clean up old data automatically:

```sql
-- Run monthly: Delete visits older than 90 days
DELETE FROM visits 
WHERE visited_at < NOW() - INTERVAL '90 days';
```

Or create a Supabase Edge Function to do this automatically.

---

## 🧪 Testing

### Manual Testing:
1. Visit your homepage
2. Check database: `SELECT * FROM visits ORDER BY visited_at DESC LIMIT 10;`
3. Refresh admin dashboard
4. Verify counts increase

### API Testing:

**Track a visit:**
```bash
curl -X POST https://your-site.com/api/track-visit \
  -H "Content-Type: application/json" \
  -d '{"page_path": "/test"}'
```

**Get statistics:**
```bash
curl https://your-site.com/api/visit-stats
```

---

## 🐛 Troubleshooting

### Visits Not Being Tracked

**Check 1:** Database table exists
```sql
SELECT * FROM visits LIMIT 1;
```

**Check 2:** VisitTracker is in layout
```typescript
// app/layout.tsx should have:
import VisitTracker from "./components/VisitTracker";
// And inside <Providers>:
<VisitTracker />
```

**Check 3:** API route works
- Open browser console
- Visit a page
- Look for network requests to `/api/track-visit`
- Should return `{success: true}`

### Dashboard Shows No Data

**Check 1:** Visit stats API works
```bash
curl https://your-site.com/api/visit-stats
```

**Check 2:** Database has data
```sql
SELECT COUNT(*) FROM visits;
```

**Check 3:** Browser console errors
- Open admin dashboard
- Check console for errors
- Fix any fetch errors

### Slow Dashboard Loading

**Option 1:** Add caching
```typescript
// In visit-stats route, add cache headers:
return NextResponse.json(
  { success: true, data: {...} },
  { 
    headers: { 
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' 
    } 
  }
);
```

**Option 2:** Load stats separately
- Don't wait for visit stats to load dashboard
- Already implemented with `loadingVisits` state!

---

## 📈 Advanced Features (Optional)

### Real-time Dashboard
Use Supabase Realtime:

```typescript
// In admin dashboard:
useEffect(() => {
  const channel = supabase
    .channel('visits')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'visits' },
      () => {
        loadVisitStats(); // Reload stats when new visit
      }
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, []);
```

### Export Data
Add an export button:

```typescript
const exportVisits = async () => {
  const { data } = await supabase
    .from('visits')
    .select('*')
    .csv();
  
  // Download CSV
  const blob = new Blob([data], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'visits.csv';
  a.click();
};
```

### Visitor Heatmap
Track page sections:

```typescript
// Add section tracking:
const trackSection = (sectionName: string) => {
  fetch('/api/track-visit', {
    method: 'POST',
    body: JSON.stringify({
      page_path: `${pathname}#${sectionName}`
    })
  });
};

// Use in components:
<section onClick={() => trackSection('hero')}>
  ...
</section>
```

---

## ✅ Checklist

Before going live:

- [ ] Run database migration in Supabase
- [ ] Deploy code to production
- [ ] Test visit tracking (visit homepage)
- [ ] Check admin dashboard shows data
- [ ] Verify data is being saved to database
- [ ] Configure admin page tracking (if desired)
- [ ] Set up data cleanup schedule (optional)

---

## 🎯 Summary

You now have a lightweight, self-hosted visit tracking system:
- ✅ Automatic tracking on all pages
- ✅ Simple admin dashboard display
- ✅ No external dependencies
- ✅ Privacy-friendly
- ✅ Lightweight and fast
- ✅ Easy to extend

**Next Step:** Run the database migration and deploy!

