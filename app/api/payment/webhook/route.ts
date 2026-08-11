import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with service role (bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔔 Webhook received from Vendo:', JSON.stringify(body, null, 2));

    const {
      partnerReference,
      merchantOrderId,
      status,
      amount,
      currency,
      flutterwaveTransactionId,
      paidAt,
      metadata
    } = body;

    // TODO: Implement webhook signature verification when Vendo provides the mechanism
    // For now, we'll validate the callback data structure and cross-check with our database
    
    if (!partnerReference || !merchantOrderId) {
      console.error('❌ Invalid webhook payload - missing required fields');
      return NextResponse.json(
        { success: false, error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    // Find the orders using either merchant order ID or partner reference
    const { data: orders, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, amount_paid, payment_status, currency, merchant_order_id, partner_reference')
      .or(`merchant_order_id.eq.${merchantOrderId},partner_reference.eq.${partnerReference}`);

    if (fetchError || !orders || orders.length === 0) {
      console.error('❌ Order not found:', { merchantOrderId, partnerReference });
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log(`📦 Found ${orders.length} order(s) for merchant order ID: ${merchantOrderId}`);

    // Check for idempotency - if already paid, return success
    const alreadyPaid = orders.every(order => order.payment_status === 'paid');
    if (alreadyPaid) {
      console.log('✅ Order already marked as paid - idempotent webhook');
      return NextResponse.json({
        success: true,
        message: 'Order already processed',
        merchantOrderId
      });
    }

    // Validate payment status
    if (status !== 'successful') {
      console.log(`⚠️ Payment not successful. Status: ${status}`);
      
      // Update orders to failed/cancelled
      if (status === 'failed' || status === 'cancelled') {
        await supabaseAdmin
          .from('orders')
          .update({
            payment_status: status === 'failed' ? 'failed' : 'pending',
            order_status: status === 'cancelled' ? 'cancelled' : 'pending'
          })
          .in('id', orders.map(o => o.id));
      }

      return NextResponse.json({
        success: true,
        message: `Payment ${status}`,
        merchantOrderId
      });
    }

    // Validate currency matches (USD)
    if (currency && currency !== 'USD') {
      console.error('❌ Currency mismatch:', { expected: 'USD', received: currency });
      return NextResponse.json(
        { success: false, error: 'Currency mismatch' },
        { status: 400 }
      );
    }

    // Calculate expected amount in USD
    const totalUSD = orders.reduce((sum, order) => sum + Number(order.amount_paid), 0);

    // Validate amount (allow small difference for rounding)
    if (amount) {
      const difference = Math.abs(amount - totalUSD);
      const tolerance = totalUSD * 0.01; // 1% tolerance
      
      if (difference > tolerance) {
        console.error('❌ Amount mismatch:', {
          expected: totalUSD,
          received: amount,
          difference
        });
        return NextResponse.json(
          { success: false, error: 'Amount mismatch' },
          { status: 400 }
        );
      }
    }

    console.log('✅ All validations passed - marking orders as paid');

    // Mark orders as paid
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        payment_status: 'paid',
        order_status: 'processing',
        flutterwave_transaction_id: flutterwaveTransactionId,
        paid_at: paidAt || new Date().toISOString()
      })
      .in('id', orders.map(o => o.id));

    if (updateError) {
      console.error('❌ Failed to update orders:', updateError);
      throw new Error('Failed to update order status');
    }

    console.log(`✅ Successfully marked ${orders.length} order(s) as paid`);

    // Send notifications (don't fail webhook if notification fails)
    try {
      // Get customer info from first order
      const { data: firstOrder } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', orders[0].id)
        .single();

      if (firstOrder) {
        const notificationPayload = {
          orders: orders,
          customerInfo: {
            name: firstOrder.customer_name,
            email: firstOrder.customer_email,
            phone: firstOrder.customer_phone
          },
          deliveryInfo: {
            country: firstOrder.customer_country,
            state: firstOrder.customer_state,
            city: firstOrder.customer_city,
            address: firstOrder.customer_address,
            postalCode: firstOrder.customer_postal_code,
            notes: firstOrder.order_notes
          },
          paymentMethod: 'Vendo/Flutterwave',
          totalAmount: totalUSD,
          currency: 'USD',
          transactionId: flutterwaveTransactionId
        };

        // Send Telegram notification to admin
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://marketnest-shop-one.vercel.app'}/api/telegram-notification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notificationPayload)
        });

        console.log('✅ Telegram notification sent');
      }
    } catch (notificationError) {
      console.error('⚠️ Failed to send notification (non-fatal):', notificationError);
      // Don't fail the webhook
    }

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed',
      merchantOrderId,
      ordersUpdated: orders.length
    });

  } catch (error: any) {
    console.error('❌ Error processing webhook:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to process webhook' 
      },
      { status: 500 }
    );
  }
}
