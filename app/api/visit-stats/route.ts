// API Route: Visit Statistics
// Returns visit counts and daily breakdown using service role (bypasses RLS)

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key for backend operations (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get total visits count
    const { count: totalVisits } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true });

    // Get today's visits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count: todayVisits } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true })
      .gte("visited_at", today.toISOString());

    // Get last 7 days breakdown
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data: recentVisits, error: recentError } = await supabase
      .from("visits")
      .select("visited_at")
      .gte("visited_at", sevenDaysAgo.toISOString())
      .order("visited_at", { ascending: true });

    if (recentError) throw recentError;

    // Group visits by date
    const dailyBreakdown: { [key: string]: number } = {};
    
    // Initialize all 7 days with 0 visits
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dailyBreakdown[dateKey] = 0;
    }

    // Count visits per day
    recentVisits?.forEach((visit) => {
      const dateKey = new Date(visit.visited_at).toISOString().split('T')[0];
      if (dailyBreakdown[dateKey] !== undefined) {
        dailyBreakdown[dateKey]++;
      }
    });

    // Convert to array format for easier display
    const dailyStats = Object.entries(dailyBreakdown).map(([date, count]) => ({
      date,
      count,
      dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalVisits: totalVisits || 0,
        todayVisits: todayVisits || 0,
        dailyStats,
      },
    });
  } catch (error: any) {
    console.error("Visit stats error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || "Failed to fetch visit statistics",
        },
      },
      { status: 500 }
    );
  }
}
