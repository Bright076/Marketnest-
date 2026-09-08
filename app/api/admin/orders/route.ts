import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key for admin operations (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Build query
    let query = supabase
      .from('orders')
      .select(`
        *,
        products (
          title,
          image_url
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filter if not 'all'
    if (filter !== 'all') {
      query = query.eq('order_status', filter);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      orders: orders || []
    });

  } catch (error: any) {
    console.error('Error in admin orders API:', error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
