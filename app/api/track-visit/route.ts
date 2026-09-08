// API Route: Track Visit
// Logs page visits to the database using service role (bypasses RLS)

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key for backend operations (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Insert visit record
    const { error } = await supabase
      .from("visits")
      .insert([
        {
          page_path,
          visited_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Visit tracking error:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Visit tracking error:", error);
    
    // Return success even on error to not disrupt user experience
    return NextResponse.json({ success: true });
  }
}
