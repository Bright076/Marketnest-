import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key to update orders (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email } = body;

    if (!userId || !email) {
      return NextResponse.json(
        { success: false, error: "Missing userId or email" },
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

    // Find all guest orders with this email
    const { data: guestOrders, error: fetchError } = await supabase
      .from('orders')
      .select('id, customer_email')
      .is('user_id', null) // Guest orders have NULL user_id
      .eq('customer_email', email);

    if (fetchError) {
      console.error('Error fetching guest orders:', fetchError);
      throw fetchError;
    }

    if (!guestOrders || guestOrders.length === 0) {
      // No guest orders found - not an error, just return success
      return NextResponse.json({
        success: true,
        message: "No guest orders found to link",
        ordersLinked: 0
      });
    }

    // Update all guest orders to link them to the new user
    const { data: updatedOrders, error: updateError } = await supabase
      .from('orders')
      .update({ user_id: userId })
      .is('user_id', null)
      .eq('customer_email', email)
      .select();

    if (updateError) {
      console.error('Error linking orders:', updateError);
      throw updateError;
    }

    console.log(`✅ Linked ${updatedOrders?.length || 0} guest orders to user ${userId}`);

    return NextResponse.json({
      success: true,
      message: `Successfully linked ${updatedOrders?.length || 0} orders to your account`,
      ordersLinked: updatedOrders?.length || 0,
      orders: updatedOrders
    });

  } catch (error: any) {
    console.error('Error in link-guest-orders API:', error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to link orders" },
      { status: 500 }
    );
  }
}
