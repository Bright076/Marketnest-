# 📝 Visit Tracking - Code Reference

Quick reference for the exact code used in the visit tracking system.

---

## 1. Database Migration

**File:** `DATABASE_MIGRATION_VISIT_TRACKING.sql`

```sql
CREATE TABLE IF NOT EXISTS visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_page_path ON visits(page_path);
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(DATE(visited_at));
```

---

## 2. Tracking Component

**File:** `app/components/VisitTracker.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages (optional)
    if (pathname?.startsWith('/admin')) {
      return;
    }

    const trackVisit = async () => {
      try {
        await fetch('/api/track-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page_path: pathname || '/' }),
        });
      } catch (error) {
        console.error('Visit tracking error:', error);
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}
```

---

## 3. Track Visit API

**File:** `app/api/track-visit/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page_path } = body;

    if (!page_path) {
      return NextResponse.json(
        { success: false, error: "Page path is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("visits")
      .insert([{ page_path, visited_at: new Date().toISOString() }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Visit tracking error:", error);
    return NextResponse.json({ success: true }); // Silent fail
  }
}
```

---

## 4. Visit Stats API

**File:** `app/api/visit-stats/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: NextRequest) {
  try {
    // Total visits
    const { count: totalVisits } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true });

    // Today's visits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count: todayVisits } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true })
      .gte("visited_at", today.toISOString());

    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data: recentVisits } = await supabase
      .from("visits")
      .select("visited_at")
      .gte("visited_at", sevenDaysAgo.toISOString())
      .order("visited_at", { ascending: true });

    // Group by date
    const dailyBreakdown: { [key: string]: number } = {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dailyBreakdown[dateKey] = 0;
    }

    recentVisits?.forEach((visit) => {
      const dateKey = new Date(visit.visited_at).toISOString().split('T')[0];
      if (dailyBreakdown[dateKey] !== undefined) {
        dailyBreakdown[dateKey]++;
      }
    });

    const dailyStats = Object.entries(dailyBreakdown).map(([date, count]) => ({
      date,
      count,
      dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
    }));

    return NextResponse.json({
      success: true,
      data: { totalVisits: totalVisits || 0, todayVisits: todayVisits || 0, dailyStats },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
```

---

## 5. Add to Layout

**File:** `app/layout.tsx`

```typescript
import VisitTracker from "./components/VisitTracker";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <VisitTracker /> {/* Add this line */}
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
```

---

## 6. Admin Dashboard Integration

**File:** `app/admin/page.tsx`

### Add to interfaces:
```typescript
interface VisitStats {
  totalVisits: number;
  todayVisits: number;
  dailyStats: Array<{
    date: string;
    count: number;
    dayName: string;
  }>;
}
```

### Add to state:
```typescript
const [visitStats, setVisitStats] = useState<VisitStats | null>(null);
const [loadingVisits, setLoadingVisits] = useState(true);
```

### Add load function:
```typescript
const loadVisitStats = async () => {
  try {
    const response = await fetch('/api/visit-stats');
    const result = await response.json();
    if (result.success) {
      setVisitStats(result.data);
    }
  } catch (error) {
    console.error('Error loading visit stats:', error);
  } finally {
    setLoadingVisits(false);
  }
};

useEffect(() => {
  loadDashboardData();
  loadVisitStats(); // Add this
}, []);
```

### Add to JSX (after stats grid):
```typescript
{/* Visitors Analytics Section */}
<div style={{ /* ... */ }}>
  <h2>👥 Visitors Analytics</h2>
  
  {loadingVisits ? (
    <div>Loading...</div>
  ) : visitStats ? (
    <>
      {/* Summary Cards */}
      <div style={{ /* grid */ }}>
        <div>{visitStats.totalVisits} Total Visits</div>
        <div>{visitStats.todayVisits} Today's Visits</div>
      </div>
      
      {/* 7-Day Chart */}
      <div>
        {visitStats.dailyStats.map(day => (
          <div key={day.date}>
            <div>{day.count}</div>
            <div>{/* Bar */}</div>
            <div>{day.dayName}</div>
          </div>
        ))}
      </div>
    </>
  ) : (
    <div>No data available</div>
  )}
</div>
```

(See full implementation in `app/admin/page.tsx`)

---

## 📊 Database Queries

### Get all visits:
```sql
SELECT * FROM visits ORDER BY visited_at DESC;
```

### Get today's count:
```sql
SELECT COUNT(*) FROM visits 
WHERE visited_at >= CURRENT_DATE;
```

### Get visits by page:
```sql
SELECT page_path, COUNT(*) as count 
FROM visits 
GROUP BY page_path 
ORDER BY count DESC;
```

### Get hourly breakdown:
```sql
SELECT 
  EXTRACT(HOUR FROM visited_at) as hour,
  COUNT(*) as count
FROM visits
WHERE visited_at >= CURRENT_DATE
GROUP BY hour
ORDER BY hour;
```

### Delete old data:
```sql
DELETE FROM visits 
WHERE visited_at < NOW() - INTERVAL '90 days';
```

---

## 🧪 Testing

### Test tracking API:
```bash
curl -X POST http://localhost:3000/api/track-visit \
  -H "Content-Type: application/json" \
  -d '{"page_path": "/test-page"}'
```

### Test stats API:
```bash
curl http://localhost:3000/api/visit-stats
```

### Expected response:
```json
{
  "success": true,
  "data": {
    "totalVisits": 150,
    "todayVisits": 25,
    "dailyStats": [
      { "date": "2026-09-01", "count": 15, "dayName": "Mon" },
      { "date": "2026-09-02", "count": 20, "dayName": "Tue" },
      ...
    ]
  }
}
```

---

## 🎨 Styling Reference

### Summary Cards:
```typescript
// Total Visits Card
<div style={{
  padding: "1rem",
  background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
  borderRadius: "12px",
  border: "2px solid #bae6fd"
}}>
  <div style={{ fontSize: "1.5rem" }}>👁️</div>
  <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0c4a6e" }}>
    {visitStats.totalVisits.toLocaleString()}
  </h3>
  <p style={{ color: "#0369a1", fontSize: "0.85rem", fontWeight: 600 }}>
    Total Visits
  </p>
</div>
```

### Bar Chart:
```typescript
// Individual Bar
<div style={{
  width: "100%",
  height: `${barHeight}px`,
  background: isToday 
    ? "linear-gradient(135deg, #16a34a 0%, #059669 100%)"
    : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  borderRadius: "6px",
  transition: "height 0.3s ease"
}} />
```

---

## ⚙️ Configuration Examples

### Track all pages including admin:
```typescript
// Remove this from VisitTracker.tsx:
if (pathname?.startsWith('/admin')) {
  return;
}
```

### Track specific pages only:
```typescript
const allowedPaths = ['/', '/products', '/cart', '/checkout'];
if (!allowedPaths.includes(pathname || '')) {
  return;
}
```

### Add more data to visits:
```typescript
// In track-visit API:
await supabase.from("visits").insert([{
  page_path,
  visited_at: new Date().toISOString(),
  user_agent: request.headers.get('user-agent'),
  referrer: request.headers.get('referer'),
}]);
```

Then add columns to database:
```sql
ALTER TABLE visits 
ADD COLUMN user_agent TEXT,
ADD COLUMN referrer TEXT;
```

---

## 🚀 Ready to Use

All code is provided above. Just:
1. Run database migration
2. Files are already created
3. Deploy and test!

For full implementation details, see the actual files in your project.

