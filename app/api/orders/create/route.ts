import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key for backend operations (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cart, formData, paymentMethod, userId } = body;

    // Validate required fields
    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
      return NextResponse.json(
        { success: false, error: "Missing required customer information" },
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

    // Create orders for each cart item
    const orderPromises = cart.map(async (item: any) => {
      const productId = item.id;
      const quantity = item.quantity;
      const itemPrice = parseFloat(item.price.replace('$', ''));
      const itemTotal = itemPrice * quantity;

      // Insert order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId || null, // NULL for guest orders
            product_id: productId,
            quantity: quantity,
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            customer_phone: formData.customer_phone,
            customer_country: formData.customer_country,
            customer_state: formData.customer_state,
            customer_city: formData.customer_city,
            customer_address: formData.customer_address,
            customer_postal_code: formData.customer_postal_code,
            order_notes: formData.order_notes || null,
            amount_paid: itemTotal,
            currency: "USD",
            payment_method: paymentMethod === "flutterwave" ? "vendo_flutterwave" : "usdt_trc20",
            payment_status: 'pending',
            order_status: 'pending'
          }
        ])
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw orderError;
      }

      // Update product stock
      const { data: currentProduct } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();

      if (currentProduct && currentProduct.stock > 0) {
        const newStock = Math.max(0, currentProduct.stock - quantity);
        const { error: stockError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', productId);

        if (stockError) {
          console.error('Stock update error:', stockError);
          // Don't fail the order if stock update fails
        }
      }

      return order;
    });

    const orders = await Promise.all(orderPromises);
    const orderIds = orders.map(o => o.id);

    console.log('✅ Orders created successfully:', orderIds);

    return NextResponse.json({
      success: true,
      orderIds: orderIds,
      orders: orders
    });

  } catch (error: any) {
    console.error('Error in order creation API:', error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
