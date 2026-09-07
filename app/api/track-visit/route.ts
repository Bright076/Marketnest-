// API Route: Track Visit
// Logs page visits to the database

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
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Visit tracking error:", error);
    
    // Return success even on error to not disrupt user experience
    return NextResponse.json({ success: true });
  }
}
